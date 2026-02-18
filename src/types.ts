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
 * Input variable information - describes an input variable and its structure.
 * Aligned with the variable-resolver data model.
 */
export interface InputVariable {

  /**
   * The variable name
   */
  name: string;

  /**
   * The expected type (e.g. 'Context', 'List', 'Number', 'String', 'Boolean').
   * Omitted when the type cannot be inferred.
   */
  type?: string;

  /**
   * For context or list inputs, nested entries describing the structure
   */
  entries?: InputVariable[];
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
   * Input variables needed by the expression
   */
  inputs?: InputVariable[];
}
