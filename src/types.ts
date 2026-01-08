/**
 * Types for FEEL analyzer
 */

/**
 * Represents a FEEL expression analysis result
 */
export interface AnalysisResult {
  /** Whether the expression is valid FEEL syntax */
  isValid: boolean;
  /** Error message if the expression is invalid */
  error?: string;
  /** Variables referenced in the expression */
  variables: string[];
  /** Type of the expression (if determinable) */
  type?: ExpressionType;
  /** The parsed AST (Abstract Syntax Tree) */
  ast?: any;
}

/**
 * Possible FEEL expression types
 */
export type ExpressionType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'date-time'
  | 'duration'
  | 'list'
  | 'context'
  | 'function'
  | 'unknown';

/**
 * Options for FEEL analyzer
 */
export interface AnalyzerOptions {
  /** Include detailed AST in the result */
  includeAst?: boolean;
  /** Strict mode for validation */
  strict?: boolean;
}
