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
 * Input type information - describes expected type of an input variable
 */
export interface InputType {

  /**
   * The expected kind of input
   */
  type: 'context' | 'list' | 'boolean' | 'number' | 'string' | 'unknown';

  /**
   * For context inputs, nested property structure
   */
  properties?: Record<string, InputType>;

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
   * Input variables structure needed by the expression
   */
  inputs?: Record<string, InputType>;
}
