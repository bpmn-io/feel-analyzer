# feel-analyzer

A library to analyze FEEL (Friendly Enough Expression Language) expressions, written in Node.js/TypeScript.

## Features

- ✅ Parse and validate FEEL expressions
- ✅ Extract variables from expressions  
- ✅ Evaluate expressions with context
- ✅ Determine expression types
- ✅ Built on [feelin](https://github.com/nikku/feelin) - a robust DMN FEEL parser
- ✅ Full TypeScript support with type definitions

## Installation

```bash
npm install feel-analyzer
```

## Usage

### Basic Analysis

```javascript
const { FEELAnalyzer } = require('feel-analyzer');

const analyzer = new FEELAnalyzer();

// Analyze an expression
const result = analyzer.analyze('x + y');

console.log(result);
// {
//   isValid: true,
//   variables: ['x', 'y'],
//   type: 'number'
// }
```

### Validation

```javascript
const analyzer = new FEELAnalyzer();

// Check if expression is valid
if (analyzer.isValid('5 + 3')) {
  console.log('Valid FEEL expression');
}

// Validate complex expressions
const isValid = analyzer.isValid('if age > 18 then "adult" else "minor"');
```

### Evaluation

```javascript
const analyzer = new FEELAnalyzer();

// Evaluate simple arithmetic
const result = analyzer.evaluate('5 + 3');
console.log(result); // 8

// Evaluate with context
const result2 = analyzer.evaluate('x + y', { x: 10, y: 20 });
console.log(result2); // 30

// Evaluate conditional expressions
const result3 = analyzer.evaluate('if score > 90 then "A" else "B"', { score: 95 });
console.log(result3); // "A"
```

### Advanced Analysis

```javascript
const analyzer = new FEELAnalyzer();

// Include AST in analysis
const result = analyzer.analyze('x + y', { includeAst: true });
console.log(result.ast); // Parsed AST structure

// Extract variables
const result2 = analyzer.analyze('if age > minAge then "allowed" else "denied"');
console.log(result2.variables); // ['age', 'minAge']
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions:

```typescript
import { FEELAnalyzer, AnalysisResult, ExpressionType } from 'feel-analyzer';

const analyzer = new FEELAnalyzer();

const result: AnalysisResult = analyzer.analyze('5 + 3');

if (result.isValid) {
  console.log('Expression type:', result.type);
  console.log('Variables:', result.variables);
}
```

## API

### `FEELAnalyzer`

The main class for analyzing FEEL expressions.

#### `analyze(expression: string, options?: AnalyzerOptions): AnalysisResult`

Analyze a FEEL expression and return detailed information.

**Parameters:**
- `expression` - The FEEL expression to analyze
- `options` - Optional analysis options
  - `includeAst` - Include the parsed AST in the result (default: false)
  - `strict` - Enable strict validation mode (default: false)

**Returns:** `AnalysisResult` object containing:
- `isValid` - Whether the expression is valid
- `variables` - Array of variable names referenced in the expression
- `type` - The determined type of the expression
- `error` - Error message if the expression is invalid
- `ast` - The parsed AST (if `includeAst` is true)

#### `isValid(expression: string): boolean`

Check if a FEEL expression is valid.

#### `evaluate(expression: string, context?: Record<string, any>): any`

Evaluate a FEEL expression with an optional context object.

## Expression Types

The analyzer can determine the following expression types:

- `string` - String literals and operations
- `number` - Numeric literals and arithmetic
- `boolean` - Boolean values and comparisons
- `date` - Date values
- `time` - Time values
- `date-time` - DateTime values
- `duration` - Duration values
- `list` - List/array values
- `context` - Context/object values
- `function` - Function values
- `unknown` - Unable to determine type

## Examples

See the [test directory](./test) for more comprehensive examples of usage.

## FEEL Language

FEEL (Friendly Enough Expression Language) is part of the DMN (Decision Model and Notation) specification. It's designed for writing business rules and expressions in a human-readable format.

Learn more about FEEL:
- [DMN Specification](https://www.omg.org/spec/DMN/)
- [FEEL Playground](https://nikku.github.io/feel-playground)

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test
```

## License

MIT

## Credits

Built with [feelin](https://github.com/nikku/feelin) by @nikku

