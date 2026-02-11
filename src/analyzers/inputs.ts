import type { SyntaxNode } from '@lezer/common';

import type { InputType } from '../types';

import {
  buildNestedProperties,
  collectFunctionParameters,
  collectIterationVariables,
  collectPathParts,
  extractContextKeys,
  forEachChild,
  hasContextBase,
  isInScope,
  nodeText,
  sortNestedProperties,
  withScope,
} from './utils';

/**
 * Describes the filter context a node is being visited in:
 * - 'none': not inside a filter expression
 * - 'list-literal': filtering over an inline list (e.g. `[{a:1}][item.a > 0]`)
 * - 'variable-list': filtering over a variable (e.g. `myList[item.a > 0]`)
 */
type FilterContext = 'none' | 'list-literal' | 'variable-list';

const ITERATION_KEYWORDS = new Set([ 'for', 'return', 'some', 'every', 'InExpressions', 'satisfies' ]);

/**
 * Walk the AST collecting all external variable references (inputs).
 * Local scopes (context keys, iteration vars, function params) are tracked
 * so that locally-defined names are excluded from the result.
 */
function extractInputNames(
    node: SyntaxNode,
    source: string,
    builtinNames: Set<string>,
): { inputs: string[]; hasErrors: boolean } {
  const inputs = new Set<string>();
  const localScopes: Set<string>[] = [ new Set() ];
  let hasErrors = false;

  function isExternal(name: string, filterCtx: FilterContext): boolean {
    return !isInScope(name, localScopes)
      && !builtinNames.has(name)
      && !(filterCtx !== 'none' && name === 'item');
  }

  const collectInputs = (node: SyntaxNode, filterCtx: FilterContext = 'none') => {
    const { name: nodeName } = node;

    if (node.type.isError) {
      hasErrors = true;
      return;
    }

    if (nodeName === 'FunctionInvocation') {
      const funcNameNode = node.getChild('VariableName');
      if (funcNameNode) {
        const funcName = nodeText(funcNameNode, source);
        if (isExternal(funcName, filterCtx)) {
          inputs.add(funcName);
        }
      }

      forEachChild(node, (child) => {
        if (child.name !== 'VariableName' && child.name !== '(' && child.name !== ')') {
          collectInputs(child, filterCtx);
        }
      });
      return;
    }

    if (nodeName === 'PathExpression') {
      if (hasContextBase(node)) {
        forEachChild(node, (child) => collectInputs(child, filterCtx));
      } else {
        const pathParts = collectPathParts(node, source);
        if (pathParts.length > 0 && isExternal(pathParts[0], filterCtx)) {
          inputs.add(pathParts.join('.'));
        }
      }
      return;
    }

    if (nodeName === 'VariableName'
      && node.parent?.name !== 'PathExpression'
      && node.parent?.name !== 'FunctionInvocation') {
      const varName = nodeText(node, source);
      const isImplicitFilterProp = filterCtx === 'variable-list' && varName !== 'item';
      if (isExternal(varName, filterCtx) && !isImplicitFilterProp) {
        inputs.add(varName);
      }
      return;
    }

    if (nodeName === 'Context' && node.parent?.name !== 'List') {
      withScope(localScopes, [], (scope) => {
        forEachChild(node, (child) => {
          if (child.name === 'ContextEntry') {
            forEachChild(child, (entryChild) => {
              if (entryChild.name !== 'Key') collectInputs(entryChild, filterCtx);
            });

            const keyName = child.getChild('Key')?.getChild('Name');
            if (keyName) scope.add(nodeText(keyName, source));
          }
        });
      });
      return;
    }

    if (nodeName === 'FilterExpression') {
      let newFilterCtx: FilterContext = 'none';
      const scopeNames: string[] = [ 'item' ];

      const listNode = node.getChild('List');
      if (listNode) {
        forEachChild(listNode, (child) => {
          if (child.name === 'Context') {
            scopeNames.push(...extractContextKeys(child, source));
          }
        });
        newFilterCtx = 'list-literal';
      } else {
        forEachChild(node, (child) => {
          if (child.name === 'VariableName') {
            collectInputs(child, 'none');
            newFilterCtx = 'variable-list';
          }
        });
      }

      withScope(localScopes, scopeNames, () => {
        forEachChild(node, (child) => {
          if (child.name === 'Comparison' || child.name === 'Expression') {
            collectInputs(child, newFilterCtx);
          }
        });
      });
      return;
    }

    if (nodeName === 'ForExpression' || nodeName === 'QuantifiedExpression') {
      const iterVars = collectIterationVariables(node, source);

      const inExp = node.getChild('InExpressions');
      if (inExp) {
        forEachChild(inExp, (child) => {
          if (child.name === 'InExpression') {
            forEachChild(child, (innerChild) => {
              if (innerChild.name !== 'Name' && innerChild.name !== 'in' && innerChild.name !== 'Identifier') {
                collectInputs(innerChild, filterCtx);
              }
            });
          }
        });
      }

      withScope(localScopes, iterVars, () => {
        forEachChild(node, (child) => {
          if (!ITERATION_KEYWORDS.has(child.name)) {
            collectInputs(child, 'none');
          }
        });
      });
      return;
    }

    if (nodeName === 'FunctionDefinition') {
      const params = collectFunctionParameters(node, source);

      withScope(localScopes, params, () => {
        if (hasErrors) return;
        const body = node.getChild('FunctionBody');
        if (body) collectInputs(body, 'none');
      });
      return;
    }

    forEachChild(node, (child) => collectInputs(child, filterCtx));
  };

  collectInputs(node);

  return {
    inputs: Array.from(inputs).sort(),
    hasErrors,
  };
}

/**
 * Initialize input types based on collected variable names.
 * Dotted paths like "a.b.c" create nested context structures.
 */
function initializeInputTypes(collectedInputs: string[]): Record<string, InputType> {
  const inputTypes: Record<string, InputType> = {};
  for (const input of collectedInputs) {
    buildNestedProperties(inputTypes, input.split('.'));
  }
  return inputTypes;
}

/**
 * Check whether a node or its nested ArithmeticExpression children
 * contain string or number literals.
 */
function checkLiteralsInNode(node: SyntaxNode): { hasString: boolean; hasNumber: boolean } {
  let hasString = false;
  let hasNumber = false;
  forEachChild(node, (child) => {
    if (child.name === 'StringLiteral') hasString = true;
    else if (child.name === 'NumericLiteral') hasNumber = true;
    else if (child.name === 'ArithmeticExpression') {
      const nested = checkLiteralsInNode(child);
      hasString = hasString || nested.hasString;
      hasNumber = hasNumber || nested.hasNumber;
    }
  });
  return { hasString, hasNumber };
}

/**
 * Infer a type for all variable references inside a node.
 * Used when surrounding context (e.g. arithmetic with a number literal)
 * implies the type of unknown variables.
 */
function inferTypeForVariablesInNode(
    node: SyntaxNode,
    source: string,
    inputTypes: Record<string, InputType>,
    localScopes: Set<string>[],
    inferredType: 'string' | 'number',
): void {

  if (node.name === 'VariableName' && node.parent?.name !== 'PathExpression') {
    const varName = nodeText(node, source);
    if (!isInScope(varName, localScopes) && inputTypes[varName]?.type === 'unknown') {
      inputTypes[varName].type = inferredType;
    }
  } else if (node.name === 'PathExpression') {
    const pathParts = collectPathParts(node, source);
    if (pathParts.length > 0) {
      const rootVar = pathParts[0];
      if (!isInScope(rootVar, localScopes) && inputTypes[rootVar]?.type === 'unknown') {
        inputTypes[rootVar].type = inferredType;
      }
    }
  } else {
    forEachChild(node, (child) => {
      inferTypeForVariablesInNode(child, source, inputTypes, localScopes, inferredType);
    });
  }
}

/**
 * Track which properties are accessed on `item` inside a filter expression
 * and record them as `itemProperties` on the list variable's type.
 */
function trackFilterItemProperties(
    node: SyntaxNode,
    source: string,
    listVarName: string | null,
    inputTypes: Record<string, InputType>,
    localScopes: Set<string>[],
): void {
  if (!listVarName || !inputTypes[listVarName]) return;

  const visit = (node: SyntaxNode) => {
    const listType = inputTypes[listVarName!];
    if (listType.type !== 'list') return;

    if (node.name === 'PathExpression') {
      const pathParts: string[] = [];
      forEachChild(node, (child) => {
        if (child.name === 'VariableName') {
          pathParts.push(nodeText(child, source));
        }
      });

      // `item.prop` → record 'prop' as an item property
      if (pathParts.length > 1 && pathParts[0] === 'item') {
        const itemProperties = listType.itemProperties || [];
        for (let i = 1; i < pathParts.length; i++) {
          if (!itemProperties.includes(pathParts[i])) {
            itemProperties.push(pathParts[i]);
          }
        }
        listType.itemProperties = itemProperties;
      }
    } else if (node.name === 'VariableName') {
      const varName = nodeText(node, source);

      // Standalone variable inside filter (not `item`, not local) → item property
      if (!isInScope(varName, localScopes) && varName !== 'item' && node.parent?.name !== 'PathExpression') {
        const itemProperties = listType.itemProperties || [];
        if (!itemProperties.includes(varName)) {
          itemProperties.push(varName);
        }
        listType.itemProperties = itemProperties;
      }
    }

    forEachChild(node, visit);
  };

  visit(node);
}

/**
 * Infer type of a variable from a direct comparison with a literal
 * (e.g. `x > 5` → x is number, `name = "foo"` → name is string).
 */
function inferTypeFromComparison(
    varNode: SyntaxNode,
    literalNode: SyntaxNode,
    source: string,
    inputTypes: Record<string, InputType>,
    localScopes: Set<string>[],
): void {
  if (varNode.name !== 'VariableName') return;

  const varName = nodeText(varNode, source);
  if (isInScope(varName, localScopes) || !inputTypes[varName]) return;

  const varType = inputTypes[varName];
  if (varType.type !== 'unknown') return;

  const literalTypeMap: Record<string, InputType['type']> = {
    NumericLiteral: 'number',
    StringLiteral: 'string',
    BooleanLiteral: 'boolean',
  };
  const inferred = literalTypeMap[literalNode.name];
  if (inferred) varType.type = inferred;
}

/**
 * Recursively walk the AST to infer types for known input variables.
 */
function inferTypes(
    node: SyntaxNode,
    source: string,
    inputTypes: Record<string, InputType>,
    localScopes: Set<string>[],
    filterCtx: FilterContext = 'none',
): void {
  const { name: nodeName } = node;

  if (nodeName === 'PathExpression') {
    const first = node.firstChild;
    if (first?.name === 'Context' || first?.name === 'PathExpression') {
      inferTypes(first, source, inputTypes, localScopes, filterCtx);
      return;
    }

    const pathParts = collectPathParts(node, source);
    if (pathParts.length > 0) {
      const rootVar = pathParts[0];
      if (!isInScope(rootVar, localScopes) && !(filterCtx !== 'none' && rootVar === 'item') && inputTypes[rootVar]) {
        buildNestedProperties(inputTypes, pathParts);
      }
    }
    return;
  }

  if (nodeName === 'Context' && node.parent?.name !== 'List') {
    withScope(localScopes, [], (scope) => {
      forEachChild(node, (child) => {
        if (child.name === 'ContextEntry') {
          forEachChild(child, (innerChild) => {
            if (innerChild.name !== 'Key') {
              inferTypes(innerChild, source, inputTypes, localScopes, filterCtx);
            }
          });

          const keyName = child.getChild('Key')?.getChild('Name');
          if (keyName) scope.add(nodeText(keyName, source));
        }
      });
    });
    return;
  }

  if (nodeName === 'FilterExpression') {
    let newFilterCtx: FilterContext = 'none';
    let listVarName: string | null = null;
    const scopeNames: string[] = [ 'item' ];

    const listNode = node.getChild('List');
    if (listNode) {
      forEachChild(listNode, (child) => {
        if (child.name === 'Context') {
          scopeNames.push(...extractContextKeys(child, source));
        }
      });
      newFilterCtx = 'list-literal';
    } else {
      forEachChild(node, (child) => {
        if (child.name === 'VariableName') {
          listVarName = nodeText(child, source);
          if (!isInScope(listVarName!, localScopes) && inputTypes[listVarName!]) {
            const varType = inputTypes[listVarName!];
            if (varType.type === 'unknown') {
              varType.type = 'list';
              varType.itemProperties = [];
            }
          }
          newFilterCtx = 'variable-list';
        }
      });
    }

    withScope(localScopes, scopeNames, () => {
      forEachChild(node, (child) => {
        if (child.name === 'Comparison' || child.name === 'Expression') {
          trackFilterItemProperties(child, source, listVarName, inputTypes, localScopes);
          inferTypes(child, source, inputTypes, localScopes, newFilterCtx);
        }
      });
    });
    return;
  }

  if (nodeName === 'Comparison') {
    const operands: SyntaxNode[] = [];
    forEachChild(node, (child) => {
      if (child.name !== 'CompareOp') operands.push(child);
    });
    if (operands.length === 2) {
      inferTypeFromComparison(operands[0], operands[1], source, inputTypes, localScopes);
      inferTypeFromComparison(operands[1], operands[0], source, inputTypes, localScopes);
    }
  }

  if (nodeName === 'ArithmeticExpression') {
    const { hasString, hasNumber } = checkLiteralsInNode(node);
    const inferredType = hasString && !hasNumber ? 'string'
      : !hasString && hasNumber ? 'number'
        : null;

    if (inferredType) {
      inferTypeForVariablesInNode(node, source, inputTypes, localScopes, inferredType);
    }

    forEachChild(node, (child) => {
      if (![ 'ArithmeticExpression', 'ArithOp', 'NumericLiteral', 'StringLiteral' ].includes(child.name)) {
        inferTypes(child, source, inputTypes, localScopes, filterCtx);
      }
    });
    return;
  }

  if (nodeName === 'ForExpression' || nodeName === 'QuantifiedExpression') {
    const iterVars = collectIterationVariables(node, source);

    const inExp = node.getChild('InExpressions');
    if (inExp) {
      forEachChild(inExp, (child) => {
        if (child.name === 'InExpression') {
          forEachChild(child, (innerChild) => {
            if (![ 'Name', 'in', 'Identifier' ].includes(innerChild.name)) {
              inferTypes(innerChild, source, inputTypes, localScopes, filterCtx);
            }
          });
        }
      });
    }

    withScope(localScopes, iterVars, () => {
      forEachChild(node, (child) => {
        if (!ITERATION_KEYWORDS.has(child.name)) {
          inferTypes(child, source, inputTypes, localScopes, 'none');
        }
      });
    });
    return;
  }

  if (nodeName === 'FunctionDefinition') {
    const params = collectFunctionParameters(node, source);

    withScope(localScopes, params, () => {
      const body = node.getChild('FunctionBody');
      if (body) inferTypes(body, source, inputTypes, localScopes, 'none');
    });
    return;
  }

  forEachChild(node, (child) => {
    inferTypes(child, source, inputTypes, localScopes, filterCtx);
  });
}

/**
 * Analyze an AST to extract input variables and infer their types.
 */
export function analyzeForInputs(
    node: SyntaxNode,
    source: string,
    builtinNames: Set<string>,
): { inputs: Record<string, InputType>; hasErrors: boolean } {
  const { inputs: collectedInputs, hasErrors } = extractInputNames(node, source, builtinNames);

  const inputTypes = initializeInputTypes(collectedInputs);

  const localScopes: Set<string>[] = [ new Set() ];
  inferTypes(node, source, inputTypes, localScopes);

  // Sort properties for deterministic output
  for (const varName in inputTypes) {
    const varType = inputTypes[varName];
    if (varType.type === 'context') sortNestedProperties(varType);
    if (varType.type === 'list' && varType.itemProperties) varType.itemProperties.sort();
  }

  return { inputs: inputTypes, hasErrors };
}
