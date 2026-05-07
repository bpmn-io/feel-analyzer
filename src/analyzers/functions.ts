import type { SyntaxNode } from '@lezer/common';

import type { InvokedFunction } from '../types';

import {
  forEachChild,
  nodeText,
} from './utils';

export function analyzeForFunctions(
    node: SyntaxNode,
    source: string,
    builtinNames: Set<string>,
): InvokedFunction[] {
  const functions = new Map<string, InvokedFunction>();

  const walk = (node: SyntaxNode) => {
    if (node.name === 'FunctionInvocation') {
      const funcNameNode = node.getChild('VariableName');
      if (funcNameNode) {
        const name = nodeText(funcNameNode, source);

        if (!functions.has(name)) {
          functions.set(name, {
            name,
            type: builtinNames.has(name) ? 'builtin' : 'user',
          });
        }
      }
    }

    forEachChild(node, walk);
  };

  walk(node);

  return Array.from(functions.values()).sort((a, b) => a.name.localeCompare(b.name));
}
