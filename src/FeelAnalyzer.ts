import type {
  AnalysisOptions,
  AnalysisResult,
  OutputType,
  InputType,
  Builtin,
} from './types.js';
import { parser, trackVariables } from 'lezer-feel';
import { SyntaxNode } from '@lezer/common';
import type { LRParser, ContextTracker } from '@lezer/lr';

/**
 * Analyzer for FEEL expressions
 */
export class FeelAnalyzer {

  /**
   * Analyze a FEEL expression
   *
   * @param expression - The FEEL expression to analyze
   * @param options - Optional analysis configuration
   * @returns Analysis result
   */
  analyze(expression: string, options?: AnalysisOptions): AnalysisResult {
    try {

      // Configure parser based on dialect
      const configuredParser = this.getConfiguredParser(options);
      const tree = configuredParser.parse(expression);

      // Extract built-in function names for filtering
      const builtinNames = this.getBuiltinNames(options?.builtins);

      const neededInputs = this.extractNeededInputs(
        tree.topNode,
        expression,
        builtinNames
      );
      const inputTypes = this.extractInputTypes(
        tree.topNode,
        expression,
        neededInputs
      );
      const outputType = this.extractOutputType(
        tree.topNode,
        expression,
        options
      );

      return {
        valid: true,
        expression,
        errors: [],
        neededInputs,
        inputTypes,
        outputType,
      };
    } catch (error) {
      return {
        valid: false,
        expression,
        errors: [
          {
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      };
    }
  }

  /**
   * Get configured parser based on options
   */
  private getConfiguredParser(options?: AnalysisOptions): LRParser {
    const dialect = options?.parserDialect || 'camunda';
    const builtins = options?.builtins;

    // Build context object from builtins for the context tracker
    // This allows the parser to recognize multi-word function names,
    // even those containing reserved keywords like "get or else"
    const context: Record<string, number> = {};
    if (builtins) {
      for (const builtin of builtins) {
        context[builtin.name] = 1;
      }
    }

    if (dialect === 'standard' && !builtins) {
      return parser;
    }

    const config: {
      dialect?: string;
      contextTracker?: ContextTracker<unknown>;
    } = {};

    if (dialect !== 'standard') {
      config.dialect = dialect;
    }

    if (builtins && Object.keys(context).length > 0) {
      config.contextTracker = trackVariables(context);
    }

    return parser.configure(config);
  }

  /**
   * Extract built-in function names from builtins array
   */
  private getBuiltinNames(builtins?: Builtin[]): Set<string> {
    if (!builtins) {
      return new Set();
    }

    return new Set(builtins.map((b) => b.name));
  }

  /**
   * Strip backticks from identifier names
   */
  private stripBackticks(text: string): string {
    return text.replace(/^`|`$/g, '');
  }

  /**
   * Extract needed input variables from the AST
   */
  private extractNeededInputs(
      node: SyntaxNode,
      source: string,
      builtinNames: Set<string>
  ): string[] {
    const inputs = new Set<string>();
    const localScopes: Set<string>[] = [ new Set() ]; // Stack of local scopes

    /**
     * Strip backticks from identifier names
     */
    const stripBackticks = (text: string): string => {
      return text.replace(/^`|`$/g, '');
    };

    /**
     * Recursively collect all parts of a path expression
     */
    const collectPathParts = (node: SyntaxNode): string[] => {
      const parts: string[] = [];
      let child = node.firstChild;

      while (child) {
        if (child.name === 'PathExpression') {

          // Recursively collect from nested path
          parts.push(...collectPathParts(child));
        } else if (child.name === 'VariableName') {
          const part = stripBackticks(source.substring(child.from, child.to));
          parts.push(part);
        }
        child = child.nextSibling;
      }

      return parts;
    };

    /**
     * Check if a path expression has a Context literal at its base
     */
    const hasContextBase = (node: SyntaxNode): boolean => {
      const firstChild = node.firstChild;
      if (!firstChild) return false;

      if (firstChild.name === 'Context') return true;
      if (firstChild.name === 'PathExpression')
        return hasContextBase(firstChild);

      return false;
    };

    const visit = (
        node: SyntaxNode,
        inFilterContext: boolean | string = false
    ) => {
      const nodeName = node.name;

      // Handle FunctionInvocation
      if (nodeName === 'FunctionInvocation') {

        // Get the function name
        const funcNameNode = node.getChild('VariableName');
        if (funcNameNode) {
          const funcName = stripBackticks(
            source.substring(funcNameNode.from, funcNameNode.to)
          );
          const isBuiltin = builtinNames.has(funcName);
          const isLocal = localScopes.some((scope) => scope.has(funcName));

          // If not a built-in and not locally defined, add as input
          if (!isBuiltin && !isLocal) {
            inputs.add(funcName);
          }
        }

        // Visit the arguments
        let child = node.firstChild;
        while (child) {

          // Skip the function name and parentheses, but visit parameters
          if (
            child.name !== 'VariableName' &&
            child.name !== '(' &&
            child.name !== ')'
          ) {
            visit(child, inFilterContext);
          }
          child = child.nextSibling;
        }
        return;
      }

      // Handle PathExpression
      if (nodeName === 'PathExpression') {

        // Check if the base is a Context literal (recursively)
        if (hasContextBase(node)) {

          // Visit children to find variables inside the context
          let child = node.firstChild;
          while (child) {
            visit(child, inFilterContext);
            child = child.nextSibling;
          }
          return;
        }

        // Build the full path for variable references
        const pathParts = collectPathParts(node);

        if (pathParts.length > 0) {
          const rootVar = pathParts[0];
          const isLocal = localScopes.some((scope) => scope.has(rootVar));
          const isItemInFilter = inFilterContext && rootVar === 'item';
          const isBuiltin = builtinNames.has(rootVar);

          if (!isLocal && !isItemInFilter && !isBuiltin) {

            // If it's a path expression, add the full path
            inputs.add(pathParts.join('.'));
          }
        }
        return; // Don't process children
      }

      // Handle standalone VariableName
      if (nodeName === 'VariableName') {

        // Check if this is part of a PathExpression or FunctionInvocation
        if (
          node.parent?.name === 'PathExpression' ||
          node.parent?.name === 'FunctionInvocation'
        ) {

          // Already handled by parent logic
          return;
        }

        const varName = stripBackticks(source.substring(node.from, node.to));
        const isLocal = localScopes.some((scope) => scope.has(varName));
        const isItemInFilter = inFilterContext && varName === 'item';
        const isBuiltin = builtinNames.has(varName);

        // If we're in a filter on a variable list (not a literal),
        // treat simple variable names as implicit item properties
        const isImplicitProperty =
          inFilterContext === 'variable-list' && varName !== 'item';

        if (!isLocal && !isItemInFilter && !isImplicitProperty && !isBuiltin) {
          inputs.add(varName);
        }
        return;
      }

      // Handle Context - create new scope
      if (nodeName === 'Context') {

        // Check if this context is inside a list (part of list items)
        const isListItem = node.parent?.name === 'List';

        if (!isListItem) {

          // Create new scope for context entries (contexts define local variables)
          const newScope = new Set<string>();
          localScopes.push(newScope);

          // Visit each context entry in order:
          // 1. Visit the value expression (which may reference external or previously defined variables)
          // 2. Add the key to the local scope (for subsequent entries to reference)
          let child = node.firstChild;
          while (child) {
            if (child.name === 'ContextEntry') {

              // First, visit the value (all children except the Key)
              let entryChild = child.firstChild;
              while (entryChild) {
                if (entryChild.name !== 'Key') {
                  visit(entryChild, inFilterContext);
                }
                entryChild = entryChild.nextSibling;
              }

              // Then, add the key to the local scope
              const key = child.getChild('Key');
              if (key) {
                const keyNode = key.getChild('Name');
                if (keyNode) {
                  const keyText = stripBackticks(
                    source.substring(keyNode.from, keyNode.to)
                  );
                  newScope.add(keyText);
                }
              }
            }
            child = child.nextSibling;
          }

          localScopes.pop();
          return;
        }
      }

      // Handle FilterExpression
      if (nodeName === 'FilterExpression') {

        // Create new scope with 'item'
        const newScope = new Set<string>();
        newScope.add('item');

        // Determine what kind of filter this is
        let filterType: boolean | string = false;

        // Check if filtering a list literal to extract property names
        const listNode = node.getChild('List');
        if (listNode) {

          // Filtering a list literal - we can extract property names
          let listChild = listNode.firstChild;
          while (listChild) {
            if (listChild.name === 'Context') {
              let contextChild = listChild.firstChild;
              while (contextChild) {
                if (contextChild.name === 'ContextEntry') {
                  const key = contextChild.getChild('Key');
                  if (key) {
                    const keyNode = key.getChild('Name');
                    if (keyNode) {
                      const keyText = source.substring(
                        keyNode.from,
                        keyNode.to
                      );
                      newScope.add(keyText);
                    }
                  }
                }
                contextChild = contextChild.nextSibling;
              }
            }
            listChild = listChild.nextSibling;
          }
          filterType = true;
        } else {

          // If filtering a variable (not a list literal), visit it first to add as dependency
          let child = node.firstChild;
          while (child) {
            if (child.name === 'VariableName') {
              visit(child, false);
              filterType = 'variable-list';
              break;
            }
            child = child.nextSibling;
          }
        }

        localScopes.push(newScope);

        // Visit the filter condition
        let child = node.firstChild;
        while (child) {
          if (child.name === 'Comparison' || child.name === 'Expression') {
            visit(child, filterType);
          }
          child = child.nextSibling;
        }

        localScopes.pop();
        return;
      }

      // Handle ForExpression (for x in list return ...)
      if (nodeName === 'ForExpression') {

        // Create new scope for loop variables
        const newScope = new Set<string>();

        // First, extract loop variable names from InExpressions
        const inExpressionsNode = node.getChild('InExpressions');
        if (inExpressionsNode) {
          let inExprChild = inExpressionsNode.firstChild;
          while (inExprChild) {
            if (inExprChild.name === 'InExpression') {

              // Get the loop variable name
              const nameNode = inExprChild.getChild('Name');
              if (nameNode) {
                const identifierNode = nameNode.getChild('Identifier');
                if (identifierNode) {
                  const varName = source.substring(
                    identifierNode.from,
                    identifierNode.to
                  );
                  newScope.add(varName);
                }
              }

              // Visit the IterationContext (what we're iterating over)
              const iterationContextNode =
                inExprChild.getChild('IterationContext');
              if (iterationContextNode) {
                visit(iterationContextNode, inFilterContext);
              }
            }
            inExprChild = inExprChild.nextSibling;
          }
        }

        // Push the new scope with loop variables
        localScopes.push(newScope);

        // Visit the return expression (everything after the InExpressions)
        // Don't pass inFilterContext - for expressions create their own scope
        let child = node.firstChild;
        while (child) {
          if (
            child.name !== 'for' &&
            child.name !== 'InExpressions' &&
            child.name !== 'return'
          ) {
            visit(child, false);
          }
          child = child.nextSibling;
        }

        localScopes.pop();
        return;
      }

      // Handle QuantifiedExpression (some/every x in list satisfies ...)
      if (nodeName === 'QuantifiedExpression') {

        // Create new scope for loop variables
        const newScope = new Set<string>();

        // First, extract loop variable names from InExpressions
        const inExpressionsNode = node.getChild('InExpressions');
        if (inExpressionsNode) {
          let inExprChild = inExpressionsNode.firstChild;
          while (inExprChild) {
            if (inExprChild.name === 'InExpression') {

              // Get the loop variable name
              const nameNode = inExprChild.getChild('Name');
              if (nameNode) {
                const identifierNode = nameNode.getChild('Identifier');
                if (identifierNode) {
                  const varName = source.substring(
                    identifierNode.from,
                    identifierNode.to
                  );
                  newScope.add(varName);
                }
              }

              // Visit the iteration context (what we're iterating over)
              // This is NOT in IterationContext node for QuantifiedExpression
              let exprChild = inExprChild.firstChild;
              while (exprChild) {
                if (
                  exprChild.name !== 'Name' &&
                  exprChild.name !== 'in' &&
                  exprChild.name !== 'Identifier'
                ) {
                  visit(exprChild, inFilterContext);
                }
                exprChild = exprChild.nextSibling;
              }
            }
            inExprChild = inExprChild.nextSibling;
          }
        }

        // Push the new scope with loop variables
        localScopes.push(newScope);

        // Visit the satisfies expression (everything after InExpressions and satisfies keyword)
        // Don't pass inFilterContext - quantified expressions create their own scope
        let child = node.firstChild;
        while (child) {
          if (
            child.name !== 'some' &&
            child.name !== 'every' &&
            child.name !== 'InExpressions' &&
            child.name !== 'satisfies'
          ) {
            visit(child, false);
          }
          child = child.nextSibling;
        }

        localScopes.pop();
        return;
      }

      // Handle FunctionDefinition (function(a, b) ...)
      if (nodeName === 'FunctionDefinition') {

        // Create new scope for function parameters
        const newScope = new Set<string>();

        // Extract parameter names from FormalParameters
        const formalParametersNode = node.getChild('FormalParameters');
        if (formalParametersNode) {
          let paramChild = formalParametersNode.firstChild;
          while (paramChild) {
            if (paramChild.name === 'FormalParameter') {
              const paramNameNode = paramChild.getChild('ParameterName');
              if (paramNameNode) {
                const nameNode = paramNameNode.getChild('Name');
                if (nameNode) {
                  const identifierNode = nameNode.getChild('Identifier');
                  if (identifierNode) {
                    const varName = source.substring(
                      identifierNode.from,
                      identifierNode.to
                    );
                    newScope.add(varName);
                  }
                }
              }
            }
            paramChild = paramChild.nextSibling;
          }
        }

        // Push the new scope with parameters
        localScopes.push(newScope);

        // Visit the function body
        // Don't pass inFilterContext - function definitions create their own scope
        const functionBodyNode = node.getChild('FunctionBody');
        if (functionBodyNode) {
          visit(functionBodyNode, false);
        }

        localScopes.pop();
        return;
      }

      // Visit children
      let child = node.firstChild;
      while (child) {
        visit(child, inFilterContext);
        child = child.nextSibling;
      }
    };

    visit(node);

    return Array.from(inputs).sort();
  }

  /**
   * Helper to collect path parts from a PathExpression node
   */
  private collectPathPartsFromNode(node: SyntaxNode, source: string): string[] {
    const parts: string[] = [];
    let child = node.firstChild;

    while (child) {
      if (child.name === 'PathExpression') {
        parts.push(...this.collectPathPartsFromNode(child, source));
      } else if (child.name === 'VariableName') {
        const part = this.stripBackticks(
          source.substring(child.from, child.to)
        );
        parts.push(part);
      }
      child = child.nextSibling;
    }

    return parts;
  }

  /**
   * Extract expected input types from the AST
   */
  private extractInputTypes(
      node: SyntaxNode,
      source: string,
      neededInputs: string[]
  ): Record<string, InputType> {
    const inputTypes: Record<string, InputType> = {};

    // Initialize all inputs, extracting root variables from paths
    for (const input of neededInputs) {
      const parts = input.split('.');
      const rootVar = parts[0];

      // Initialize root variable if not already present
      if (!inputTypes[rootVar]) {
        inputTypes[rootVar] = { type: 'unknown' };
      }

      // If it's a path, mark as context with properties
      if (parts.length > 1) {
        if (inputTypes[rootVar].type === 'unknown') {
          inputTypes[rootVar].type = 'context';
          inputTypes[rootVar].properties = [];
        }

        if (inputTypes[rootVar].type === 'context') {
          const properties = inputTypes[rootVar].properties || [];
          for (let i = 1; i < parts.length; i++) {
            if (!properties.includes(parts[i])) {
              properties.push(parts[i]);
            }
          }
          inputTypes[rootVar].properties = properties;
        }
      }
    }

    const localScopes: Set<string>[] = [ new Set() ];

    const visit = (
        node: SyntaxNode,
        inFilterContext: boolean | string = false
    ) => {
      const nodeName = node.name;

      // Handle PathExpression - indicates a context type
      if (nodeName === 'PathExpression') {
        const firstChild = node.firstChild;

        // Skip literal contexts
        if (
          firstChild?.name === 'Context' ||
          firstChild?.name === 'PathExpression'
        ) {
          visit(firstChild, inFilterContext);
          return;
        }

        // Build the path
        const pathParts: string[] = [];
        let child = node.firstChild;

        while (child) {
          if (child.name === 'VariableName') {
            const part = this.stripBackticks(
              source.substring(child.from, child.to)
            );
            pathParts.push(part);
          }
          child = child.nextSibling;
        }

        if (pathParts.length > 0) {
          const rootVar = pathParts[0];
          const isLocal = localScopes.some((scope) => scope.has(rootVar));
          const isItemInFilter = inFilterContext && rootVar === 'item';

          if (!isLocal && !isItemInFilter && inputTypes[rootVar]) {

            // This is a context with accessed properties
            const currentType = inputTypes[rootVar];

            if (currentType.type === 'unknown') {
              currentType.type = 'context';
              currentType.properties = [];
            }

            if (currentType.type === 'context' && pathParts.length > 1) {
              const properties = currentType.properties || [];

              // Add all property parts (excluding the root variable)
              for (let i = 1; i < pathParts.length; i++) {
                if (!properties.includes(pathParts[i])) {
                  properties.push(pathParts[i]);
                }
              }
              currentType.properties = properties;
            }
          }
        }
        return;
      }

      // Handle Context - create new scope
      if (nodeName === 'Context') {
        const isListItem = node.parent?.name === 'List';

        if (!isListItem) {
          const newScope = new Set<string>();
          localScopes.push(newScope);

          let child = node.firstChild;
          while (child) {
            if (child.name === 'ContextEntry') {
              let entryChild = child.firstChild;
              while (entryChild) {
                if (entryChild.name !== 'Key') {
                  visit(entryChild, inFilterContext);
                }
                entryChild = entryChild.nextSibling;
              }

              const key = child.getChild('Key');
              if (key) {
                const keyNode = key.getChild('Name');
                if (keyNode) {
                  const keyText = this.stripBackticks(
                    source.substring(keyNode.from, keyNode.to)
                  );
                  newScope.add(keyText);
                }
              }
            }
            child = child.nextSibling;
          }

          localScopes.pop();
          return;
        }
      }

      // Handle FilterExpression - indicates a list type
      if (nodeName === 'FilterExpression') {
        const newScope = new Set<string>();
        newScope.add('item');

        let filterType: boolean | string = false;
        let listVarName: string | null = null;

        // Check if filtering a list literal
        const listNode = node.getChild('List');
        if (listNode) {

          // Extract item properties from list literal
          let listChild = listNode.firstChild;
          while (listChild) {
            if (listChild.name === 'Context') {
              let contextChild = listChild.firstChild;
              while (contextChild) {
                if (contextChild.name === 'ContextEntry') {
                  const key = contextChild.getChild('Key');
                  if (key) {
                    const keyNode = key.getChild('Name');
                    if (keyNode) {
                      const keyText = this.stripBackticks(
                        source.substring(keyNode.from, keyNode.to)
                      );
                      newScope.add(keyText);
                    }
                  }
                }
                contextChild = contextChild.nextSibling;
              }
            }
            listChild = listChild.nextSibling;
          }
          filterType = true;
        } else {

          // If filtering a variable, mark it as a list
          let child = node.firstChild;
          while (child) {
            if (child.name === 'VariableName') {
              listVarName = this.stripBackticks(
                source.substring(child.from, child.to)
              );
              const isLocal = localScopes.some((scope) =>
                scope.has(listVarName!)
              );

              if (!isLocal && inputTypes[listVarName]) {
                const currentType = inputTypes[listVarName];
                if (currentType.type === 'unknown') {
                  currentType.type = 'list';
                  currentType.itemProperties = [];
                }
              }
              filterType = 'variable-list';
              break;
            }
            child = child.nextSibling;
          }
        }

        localScopes.push(newScope);

        // Visit the filter condition and track item property accesses
        let child = node.firstChild;
        while (child) {
          if (child.name === 'Comparison' || child.name === 'Expression') {
            this.trackFilterItemProperties(
              child,
              source,
              listVarName,
              inputTypes,
              localScopes
            );
            visit(child, filterType);
          }
          child = child.nextSibling;
        }

        localScopes.pop();
        return;
      }

      // Handle Comparison - infer types from comparisons
      if (nodeName === 'Comparison') {
        const children: SyntaxNode[] = [];
        let child = node.firstChild;

        while (child) {
          if (child.name !== 'CompareOp') {
            children.push(child);
          }
          child = child.nextSibling;
        }

        // If comparing a variable to a literal, infer type
        if (children.length === 2) {
          this.inferTypeFromComparison(
            children[0],
            children[1],
            source,
            inputTypes,
            localScopes
          );
          this.inferTypeFromComparison(
            children[1],
            children[0],
            source,
            inputTypes,
            localScopes
          );
        }
      }

      // Handle ArithmeticExpression - check if it's string concatenation or numeric
      if (nodeName === 'ArithmeticExpression') {

        // First pass: check for string literals or numeric literals in entire tree
        let hasStringLiteral = false;
        let hasNumericLiteral = false;

        const checkForStringOrNumber = (
            n: SyntaxNode
        ): { hasString: boolean; hasNumber: boolean } => {
          let hasString = false;
          let hasNumber = false;
          let c = n.firstChild;
          while (c) {
            if (c.name === 'StringLiteral') {
              hasString = true;
            } else if (c.name === 'NumericLiteral') {
              hasNumber = true;
            } else if (c.name === 'ArithmeticExpression') {
              const nested = checkForStringOrNumber(c);
              hasString = hasString || nested.hasString;
              hasNumber = hasNumber || nested.hasNumber;
            }
            c = c.nextSibling;
          }
          return { hasString, hasNumber };
        };

        const literals = checkForStringOrNumber(node);
        hasStringLiteral = literals.hasString;
        hasNumericLiteral = literals.hasNumber;

        // If we have both string and number literals, type is ambiguous
        // If we have only string literal, it's string concatenation
        // If we have only numeric literal, it's numeric addition
        const inferredType =
          hasStringLiteral && !hasNumericLiteral
            ? 'string'
            : !hasStringLiteral && hasNumericLiteral
              ? 'number'
              : null; // ambiguous or unknown

        if (inferredType) {

          // Recursively collect all variables and path expressions from the entire tree
          const collectVariablesAndPaths = (n: SyntaxNode) => {
            if (
              n.name === 'VariableName' &&
              n.parent?.name !== 'PathExpression'
            ) {
              const varName = this.stripBackticks(
                source.substring(n.from, n.to)
              );
              const isLocal = localScopes.some((scope) => scope.has(varName));

              if (!isLocal && inputTypes[varName]) {
                const currentType = inputTypes[varName];
                if (currentType.type === 'unknown') {
                  currentType.type = inferredType;
                }
              }
            } else if (n.name === 'PathExpression') {
              const pathParts = this.collectPathPartsFromNode(n, source);

              if (pathParts.length > 0) {
                const rootVar = pathParts[0];
                const isLocal = localScopes.some((scope) => scope.has(rootVar));
                if (
                  !isLocal &&
                  inputTypes[rootVar] &&
                  inputTypes[rootVar].type === 'unknown'
                ) {
                  inputTypes[rootVar].type = inferredType;
                }
              }
            } else {

              // Recurse into children
              let child = n.firstChild;
              while (child) {
                collectVariablesAndPaths(child);
                child = child.nextSibling;
              }
            }
          };

          collectVariablesAndPaths(node);
        }

        // Don't visit child ArithmeticExpressions - we already processed the entire tree
        // But do visit other children that might contain contexts, etc.
        let childToVisit = node.firstChild;
        while (childToVisit) {
          if (
            childToVisit.name !== 'ArithmeticExpression' &&
            childToVisit.name !== 'VariableName' &&
            childToVisit.name !== 'PathExpression' &&
            childToVisit.name !== 'NumericLiteral' &&
            childToVisit.name !== 'StringLiteral' &&
            childToVisit.name !== 'ArithOp'
          ) {
            visit(childToVisit, inFilterContext);
          }
          childToVisit = childToVisit.nextSibling;
        }
        return;
      }

      // Visit children
      let child = node.firstChild;
      while (child) {
        visit(child, inFilterContext);
        child = child.nextSibling;
      }
    };

    visit(node);

    return inputTypes;
  }

  /**
   * Track item property accesses in filter expressions
   */
  private trackFilterItemProperties(
      node: SyntaxNode,
      source: string,
      listVarName: string | null,
      inputTypes: Record<string, InputType>,
      localScopes: Set<string>[]
  ) {
    if (!listVarName || !inputTypes[listVarName]) return;

    const visit = (node: SyntaxNode) => {

      // Look for item.property or just property (implicit item)
      if (node.name === 'PathExpression') {
        const pathParts: string[] = [];
        let child = node.firstChild;

        while (child) {
          if (child.name === 'VariableName') {
            const part = this.stripBackticks(
              source.substring(child.from, child.to)
            );
            pathParts.push(part);
          }
          child = child.nextSibling;
        }

        // If it starts with "item", add the properties to the list's item structure
        if (pathParts.length > 1 && pathParts[0] === 'item') {
          const currentType = inputTypes[listVarName];
          if (currentType.type === 'list') {
            const itemProperties = currentType.itemProperties || [];
            for (let i = 1; i < pathParts.length; i++) {
              if (!itemProperties.includes(pathParts[i])) {
                itemProperties.push(pathParts[i]);
              }
            }
            currentType.itemProperties = itemProperties;
          }
        }
      } else if (node.name === 'VariableName') {

        // Check for implicit item properties (just "x" instead of "item.x")
        const varName = this.stripBackticks(
          source.substring(node.from, node.to)
        );
        const isLocal = localScopes.some((scope) => scope.has(varName));

        // If it's not local and not "item", it might be an implicit property
        if (
          !isLocal &&
          varName !== 'item' &&
          node.parent?.name !== 'PathExpression'
        ) {
          const currentType = inputTypes[listVarName];
          if (currentType.type === 'list') {
            const itemProperties = currentType.itemProperties || [];
            if (!itemProperties.includes(varName)) {
              itemProperties.push(varName);
            }
            currentType.itemProperties = itemProperties;
          }
        }
      }

      // Visit children
      let child = node.firstChild;
      while (child) {
        visit(child);
        child = child.nextSibling;
      }
    };

    visit(node);
  }

  /**
   * Infer type from comparison with literals
   */
  private inferTypeFromComparison(
      varNode: SyntaxNode,
      literalNode: SyntaxNode,
      source: string,
      inputTypes: Record<string, InputType>,
      localScopes: Set<string>[]
  ) {

    // If varNode is a variable and literalNode is a literal, infer type
    if (varNode.name === 'VariableName') {
      const varName = this.stripBackticks(
        source.substring(varNode.from, varNode.to)
      );
      const isLocal = localScopes.some((scope) => scope.has(varName));

      if (!isLocal && inputTypes[varName]) {
        const currentType = inputTypes[varName];

        // Only update if current type is unknown
        if (currentType.type === 'unknown') {
          if (literalNode.name === 'NumericLiteral') {
            currentType.type = 'number';
          } else if (literalNode.name === 'StringLiteral') {
            currentType.type = 'string';
          } else if (literalNode.name === 'BooleanLiteral') {
            currentType.type = 'boolean';
          }
        }
      }
    }
  }

  /**
   * Extract output type information from the AST
   */
  private extractOutputType(
      node: SyntaxNode,
      source: string,
      options?: AnalysisOptions
  ): OutputType {

    // Get the main expression node
    const expressionNode = node.name === 'Expression' ? node.firstChild : node;

    if (!expressionNode) {
      return { type: 'unknown' };
    }

    return this.analyzeNodeOutputType(expressionNode, source, options);
  }

  /**
   * Analyze the output type of a specific node
   */
  private analyzeNodeOutputType(
      node: SyntaxNode,
      source: string,
      options?: AnalysisOptions
  ): OutputType {
    const nodeName = node.name;

    // Variable reference - look up type in context
    if (nodeName === 'VariableName') {
      const varName = this.stripBackticks(source.substring(node.from, node.to));
      if (options?.context && varName in options.context) {
        return this.inferTypeFromValue(options.context[varName]);
      }
      return { type: 'unknown' };
    }

    // Path expression - try to resolve the type
    if (nodeName === 'PathExpression') {
      const firstChild = node.firstChild;
      if (firstChild?.name === 'VariableName' && options?.context) {
        const varName = this.stripBackticks(
          source.substring(firstChild.from, firstChild.to)
        );
        if (varName in options.context) {

          // We have the base object, but path resolution would need more work
          // For now, return unknown for path expressions on variables
          return { type: 'unknown' };
        }
      }

      // If the base is a context, analyze it
      if (firstChild?.name === 'Context') {
        return { type: 'value' };
      }
      return { type: 'value' };
    }

    // Context literal
    if (nodeName === 'Context') {
      const keys: string[] = [];
      let child = node.firstChild;

      while (child) {
        if (child.name === 'ContextEntry') {
          const keyNode = child.getChild('Key');
          if (keyNode) {
            const nameNode = keyNode.getChild('Name');
            if (nameNode) {
              const keyText = this.stripBackticks(
                source.substring(nameNode.from, nameNode.to)
              );
              keys.push(keyText);
            }
          }
        }
        child = child.nextSibling;
      }

      return { type: 'context', keys };
    }

    // List literal or filter expression
    if (nodeName === 'List' || nodeName === 'FilterExpression') {
      return { type: 'list' };
    }

    // Boolean literal
    if (nodeName === 'BooleanLiteral') {
      return { type: 'boolean' };
    }

    // Numeric literal
    if (nodeName === 'NumericLiteral') {
      return { type: 'number' };
    }

    // String literal
    if (nodeName === 'StringLiteral') {
      return { type: 'string' };
    }

    // Comparison operators produce boolean
    if (nodeName === 'Comparison') {
      return { type: 'boolean' };
    }

    // Quantified expressions (some, every) produce boolean
    if (nodeName === 'QuantifiedExpression') {
      return { type: 'boolean' };
    }

    // Arithmetic expressions - type depends on operands
    // + can be string concat or number addition
    // -, *, / are always numeric
    if (nodeName === 'ArithmeticExpression') {

      // Check if we can determine operand types
      const operandTypes = new Set<string>();
      let child = node.firstChild;

      while (child) {
        if (child.name !== 'ArithOp') {
          const operandType = this.analyzeNodeOutputType(
            child,
            source,
            options
          );
          if (operandType.type !== 'unknown' && operandType.type !== 'value') {
            operandTypes.add(operandType.type);
          }
        }
        child = child.nextSibling;
      }

      // If all operands are numbers, result is number
      if (operandTypes.size === 1 && operandTypes.has('number')) {
        return { type: 'number' };
      }

      // If all operands are strings, result is string (for +)
      if (operandTypes.size === 1 && operandTypes.has('string')) {
        return { type: 'string' };
      }

      // Otherwise, we can't determine the type
      return { type: 'unknown' };
    }

    // For other cases, return value (generic)
    return { type: 'value' };
  }

  /**
   * Infer type from a runtime value
   */
  private inferTypeFromValue(value: unknown): OutputType {
    if (typeof value === 'string') {
      return { type: 'string' };
    }
    if (typeof value === 'number') {
      return { type: 'number' };
    }
    if (typeof value === 'boolean') {
      return { type: 'boolean' };
    }
    if (Array.isArray(value)) {
      return { type: 'list' };
    }
    if (value !== null && typeof value === 'object') {
      const keys = Object.keys(value);
      return { type: 'context', keys };
    }
    return { type: 'unknown' };
  }
}
