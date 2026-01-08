import * as feelin from 'feelin';
import { AnalysisResult, AnalyzerOptions, ExpressionType } from './types';

/**
 * FEELAnalyzer - A class to analyze FEEL expressions
 */
export class FEELAnalyzer {
  private parser: any;

  constructor() {
    this.parser = feelin;
  }

  /**
   * Analyze a FEEL expression
   * @param expression The FEEL expression to analyze
   * @param options Analysis options
   * @returns Analysis result containing validity, variables, and type information
   */
  analyze(expression: string, options: AnalyzerOptions = {}): AnalysisResult {
    const result: AnalysisResult = {
      isValid: false,
      variables: [],
    };

    try {
      // Parse the expression
      const parsed = this.parser.parseExpression(expression);
      
      result.isValid = true;
      result.ast = options.includeAst ? parsed : undefined;
      
      // Extract variables using a simpler heuristic approach
      result.variables = this.extractVariablesHeuristic(expression);
      
      // Try to determine the expression type by evaluation
      result.type = this.determineTypeByEvaluation(expression);
      
    } catch (error) {
      result.isValid = false;
      result.error = error instanceof Error ? error.message : String(error);
    }

    return result;
  }

  /**
   * Extract variable names using a heuristic approach
   * @param expression The FEEL expression
   * @returns Array of potential variable names
   */
  private extractVariablesHeuristic(expression: string): string[] {
    const variables = new Set<string>();
    
    // Remove string literals first to avoid false positives
    const withoutStrings = expression.replace(/"[^"]*"/g, '');
    
    // Simple regex to match potential identifiers that are not keywords or literals
    // This is a simplified heuristic approach
    const keywords = new Set([
      'if', 'then', 'else', 'for', 'in', 'return', 'some', 'every',
      'satisfies', 'and', 'or', 'not', 'true', 'false', 'null',
      'function', 'external'
    ]);
    
    // Match simple identifiers (single words without spaces)
    const identifierPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    let match;
    
    while ((match = identifierPattern.exec(withoutStrings)) !== null) {
      const identifier = match[1];
      if (!keywords.has(identifier.toLowerCase()) && !identifier.match(/^\d/)) {
        variables.add(identifier);
      }
    }
    
    return Array.from(variables);
  }

  /**
   * Determine type by attempting evaluation
   * @param expression The FEEL expression
   * @returns The expression type
   */
  private determineTypeByEvaluation(expression: string): ExpressionType {
    try {
      const result = this.parser.evaluate(expression, {});
      
      if (result === null || result === undefined) {
        return 'unknown';
      }
      
      if (Array.isArray(result)) {
        return 'list';
      }
      
      const resultType = typeof result;
      switch (resultType) {
        case 'string':
          return 'string';
        case 'number':
          return 'number';
        case 'boolean':
          return 'boolean';
        case 'object':
          return 'context';
        case 'function':
          return 'function';
        default:
          return 'unknown';
      }
    } catch {
      return 'unknown';
    }
  }

  /**
   * Extract variable names from the parsed AST (Lezer tree)
   * @param ast The parsed AST
   * @returns Array of variable names
   */
  private extractVariables(ast: any): string[] {
    const variables = new Set<string>();
    const visited = new WeakSet();
    
    const traverse = (node: any) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      // Avoid circular references
      if (visited.has(node)) {
        return;
      }
      visited.add(node);

      // Check if this is a variable reference
      if (node.type === 'VariableName' && node.variableName) {
        variables.add(node.variableName);
      }

      // Traverse nested structures
      if (Array.isArray(node)) {
        node.forEach(traverse);
      } else {
        Object.values(node).forEach(traverse);
      }
    };

    traverse(ast);
    return Array.from(variables);
  }

  /**
   * Determine the type of expression from the AST
   * @param ast The parsed AST
   * @returns The expression type
   */
  private determineType(ast: any): ExpressionType {
    if (!ast || typeof ast !== 'object') {
      return 'unknown';
    }

    // Check the AST node type
    if (ast.type) {
      switch (ast.type) {
        case 'Literal':
          return this.determineLiteralType(ast);
        case 'ArithmeticExpression':
          return 'number';
        case 'Comparison':
          return 'boolean';
        case 'List':
          return 'list';
        case 'Context':
          return 'context';
        case 'FunctionInvocation':
          return 'function';
        default:
          return 'unknown';
      }
    }

    return 'unknown';
  }

  /**
   * Determine the type of a literal value
   * @param node The literal AST node
   * @returns The literal type
   */
  private determineLiteralType(node: any): ExpressionType {
    if (node.value === null || node.value === undefined) {
      return 'unknown';
    }

    const value = node.value;
    
    if (typeof value === 'string') {
      return 'string';
    }
    if (typeof value === 'number') {
      return 'number';
    }
    if (typeof value === 'boolean') {
      return 'boolean';
    }

    return 'unknown';
  }

  /**
   * Validate a FEEL expression
   * @param expression The FEEL expression to validate
   * @returns True if the expression is valid, false otherwise
   */
  isValid(expression: string): boolean {
    try {
      this.parser.parseExpression(expression);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Evaluate a FEEL expression with a given context
   * @param expression The FEEL expression to evaluate
   * @param context The context object with variable values
   * @returns The evaluated result
   */
  evaluate(expression: string, context: Record<string, any> = {}): any {
    try {
      return this.parser.evaluate(expression, context);
    } catch (error) {
      throw new Error(`Evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
