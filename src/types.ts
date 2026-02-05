/**
 * Built-in function definition
 */
export interface Builtin {

  /**
   * Function name
   */
  name: string;

  /**
   * Function type
   */
  type?: 'function';

  /**
   * Function parameters
   */
  params?: Array<{
    name: string;
  }>;

  /**
   * Function documentation
   */
  info?: string;
}

/**
 * Parser dialect to use
 */
export type ParserDialect = 'standard' | 'camunda';

/**
 * Options for analyzing FEEL expressions
 */
export interface AnalysisOptions {

  /**
   * Context variables available in the expression
   */
  context?: Record<string, unknown>;

  /**
   * Whether to perform strict validation
   */
  strict?: boolean;

  /**
   * Parser dialect to use (default: 'camunda')
   */
  parserDialect?: ParserDialect;

  /**
   * Built-in functions available in the expression
   */
  builtins?: Builtin[];
}

/**
 * Error in a FEEL expression
 */
export interface AnalysisError {

  /**
   * Error message
   */
  message: string;

  /**
   * Line number where the error occurred (1-based)
   */
  line?: number;

  /**
   * Column number where the error occurred (1-based)
   */
  column?: number;
}

/**
 * Output type information
 */
export interface OutputType {

  /**
   * The kind of output
   */
  type:
    | 'value'
    | 'context'
    | 'list'
    | 'boolean'
    | 'number'
    | 'string'
    | 'unknown';

  /**
   * For context outputs, the known keys
   */
  keys?: string[];

  /**
   * For list outputs, information about the item type
   */
  itemType?: OutputType;
}

/**
 * Input type information - describes expected type of an input variable
 */
export interface InputType {

  /**
   * The expected kind of input
   */
  type: 'context' | 'list' | 'boolean' | 'number' | 'string' | 'unknown';

  /**
   * For context inputs, the properties that are accessed
   */
  properties?: string[];

  /**
   * For list inputs, information about expected item structure
   */
  itemProperties?: string[];
}

/**
 * Result of analyzing a FEEL expression
 */
export interface AnalysisResult {

  /**
   * Whether the expression is valid
   */
  valid: boolean;

  /**
   * The analyzed expression
   */
  expression: string;

  /**
   * Errors found during analysis
   */
  errors: AnalysisError[];

  /**
   * Input variables needed by the expression
   */
  neededInputs?: string[];

  /**
   * Expected types for input variables
   */
  inputTypes?: Record<string, InputType>;

  /**
   * Information about the output type/shape
   */
  outputType?: OutputType;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}
