# feel-analyzer

> A TypeScript library for analyzing FEEL (Friendly Enough Expression Language) expressions.

[![CI](https://github.com/bpmn-io/feel-analyzer/workflows/CI/badge.svg)](https://github.com/bpmn-io/feel-analyzer/actions?query=workflow%3ACI)

## Features

- **Input Analysis**: Detects required inputs and their types from FEEL expressions
- **Type Inference**: Infers input types from usage patterns (context, list, string, number)
- **Syntax Validation**: Validates FEEL expression syntax
- **Output Type Detection**: Determines the output type of expressions

## Playground

Try the interactive playground: [https://bpmn-io.github.io/feel-analyzer/](https://bpmn-io.github.io/feel-analyzer/)

The playground allows you to:
- Test FEEL expressions in real-time
- View syntax trees and analysis results
- Compare evaluation results between different FEEL engines
- See performance metrics for each operation
- Share examples via URL

## Installation

```bash
npm install @bpmn-io/feel-analyzer
```

## Usage

### Basic Example

```typescript
import { FeelAnalyzer } from '@bpmn-io/feel-analyzer';

const analyzer = new FeelAnalyzer();

const result = analyzer.analyze('x + y');

console.log(result.valid); // true
console.log(result.errors); // []
console.log(result.neededInputs); // ['x', 'y']
console.log(result.inputTypes); // { x: { type: 'unknown' }, y: { type: 'unknown' } }
console.log(result.outputType); // { type: 'unknown' }
```

### Type Inference with Context

Provide context to enable better type inference:

```typescript
const result = analyzer.analyze('user.name + " " + user.email', {
  context: {
    user: {
      name: 'John',
      email: 'john@example.com'
    }
  }
});

console.log(result.neededInputs); // ['user.name', 'user.email']
console.log(result.inputTypes);
// {
//   user: {
//     type: 'context',
//     properties: ['name', 'email']
//   }
// }
console.log(result.outputType); // { type: 'string' }
```

### Advanced Type Inference

The analyzer detects various types from usage patterns:

```typescript
// Number operations
analyzer.analyze('age * 2').inputTypes;
// { age: { type: 'number' } }

// List operations
analyzer.analyze('items[1]').inputTypes;
// { items: { type: 'list' } }

// String concatenation
analyzer.analyze('firstName + lastName').inputTypes;
// { firstName: { type: 'string' }, lastName: { type: 'string' } }

// Context properties
analyzer.analyze('order.items[1].price', {
  context: { order: { items: [{ price: 10 }] } }
}).inputTypes;
// {
//   order: {
//     type: 'context',
//     properties: ['items']
//   }
// }
```

## API

### `analyzer.analyze(expression, options?)`

Analyzes a FEEL expression and returns detailed information.

**Parameters:**
- `expression` (string): The FEEL expression to analyze
- `options` (optional):
  - `context` (object): Context object for enhanced type inference

**Returns:**
- `valid` (boolean): Whether the expression is syntactically valid
- `errors` (array): List of syntax errors, if any
- `neededInputs` (array): List of required input variable names (including nested properties like `user.name`)
- `inputTypes` (object): Inferred types for each input variable, with possible values:
  - `{ type: 'string' }` - String type
  - `{ type: 'number' }` - Number type
  - `{ type: 'boolean' }` - Boolean type
  - `{ type: 'context', properties: string[] }` - Object/context with known properties
  - `{ type: 'list', itemProperties?: string[] }` - List/array, optionally with item properties
  - `{ type: 'date' | 'time' | 'dateTime' | 'duration' }` - Temporal types
  - `{ type: 'unknown' }` - Type cannot be inferred
- `outputType` (object): Inferred output type (same structure as inputTypes)

## Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Build the library:

```bash
npm run build
```

Lint the code:

```bash
npm run lint
```

Run all checks (lint, test, build):

```bash
npm run all
```

## Development Resources

### FEEL Scala Playground

For testing and development, you can use the FEEL Scala Playground:

```bash
docker run -e JAVA_OPTS="-Dplayground.tracking.enabled=false" -e MIXPANEL_PROJECT_TOKEN=false -p 8123:8080 ghcr.io/camunda-community-hub/feel-scala-playground:1.3.9
```

Test the playground:

```bash
curl --header "Content-Type: application/json" \
  -X POST \
  -d '{"expression":"x + y", "context":{"x": 2, "y": 3}, "metadata": {"source": "test"}}' \
  localhost:8123/api/v1/feel/evaluate
```

## License

MIT
