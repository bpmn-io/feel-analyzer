import { parser, trackVariables } from '@bpmn-io/lezer-feel';

import type { AnalysisResult, Builtin } from './types';

import { analyzeForInputs } from './analyzers/inputs';
import { analyzeForFunctions } from './analyzers/functions';
import { createContext } from './utils/create-context';

export interface FeelAnalyzerOptions {
  dialect: 'expression' | 'unaryTests';
  parserDialect: undefined | 'camunda';
  builtins: Builtin[];
  reservedNameBuiltins: Builtin[];
}

export class FeelAnalyzer {
  builtinNames: Set<string>;
  parser: typeof parser;

  constructor(options: Partial<FeelAnalyzerOptions> = {}) {
    this.builtinNames = new Set(options.builtins?.map((b) => b.name) ?? []);

    const config: Record<string, unknown> = {
      top: options.dialect === 'unaryTests' ? 'UnaryTests' : 'Expression',
      dialect: options.parserDialect,
    };

    if (options.reservedNameBuiltins && options.reservedNameBuiltins.length > 0) {
      config.contextTracker = trackVariables(createContext(options.reservedNameBuiltins));
    }

    this.parser = parser.configure(config);
  }
  analyzeExpression(expression: string): AnalysisResult {
    const tree = this.parser.parse(expression);

    const { inputs, hasErrors } = analyzeForInputs(tree.topNode, expression, this.builtinNames);
    const functions = analyzeForFunctions(tree.topNode, expression, this.builtinNames);

    return {
      valid: !hasErrors,
      inputs,
      functions,
    };
  }
}
