# Getting Started with feel-analyzer

This guide will help you get started with the feel-analyzer library.

## Installation

```bash
npm install feel-analyzer
```

## Quick Start

```javascript
const { FEELAnalyzer } = require('feel-analyzer');

// Create an analyzer instance
const analyzer = new FEELAnalyzer();

// Analyze an expression
const result = analyzer.analyze('x + y');
console.log(result);
// {
//   isValid: true,
//   variables: ['x', 'y'],
//   type: 'number'
// }

// Evaluate with context
const value = analyzer.evaluate('x + y', { x: 5, y: 10 });
console.log(value); // 15
```

## Use Cases

### 1. Validating User Input

```javascript
const userExpression = req.body.expression;

if (analyzer.isValid(userExpression)) {
  // Process the valid expression
  const result = analyzer.evaluate(userExpression, context);
  res.json({ result });
} else {
  res.status(400).json({ error: 'Invalid FEEL expression' });
}
```

### 2. Extracting Dependencies

```javascript
const formula = 'if totalPrice > 100 then discount * 0.1 else 0';
const analysis = analyzer.analyze(formula);

console.log('Required variables:', analysis.variables);
// ['totalPrice', 'discount']

// You can then prompt the user for these variables
```

### 3. Dynamic Rule Engine

```javascript
const rules = [
  { name: 'age_check', expression: 'age >= 18', message: 'Must be 18 or older' },
  { name: 'credit_check', expression: 'creditScore > 600', message: 'Credit score too low' }
];

function validateRules(userData) {
  const failures = [];
  
  for (const rule of rules) {
    try {
      const result = analyzer.evaluate(rule.expression, userData);
      if (!result) {
        failures.push(rule.message);
      }
    } catch (error) {
      console.error(`Error in rule ${rule.name}:`, error);
    }
  }
  
  return failures;
}

const errors = validateRules({ age: 16, creditScore: 650 });
// ['Must be 18 or older']
```

### 4. Business Process Automation

```javascript
// Define decision logic in FEEL
const pricingRules = {
  basic: 'if orderAmount < 100 then orderAmount * 1.0 else null',
  premium: 'if orderAmount >= 100 and orderAmount < 500 then orderAmount * 0.9 else null',
  enterprise: 'if orderAmount >= 500 then orderAmount * 0.8 else null'
};

function calculatePrice(orderAmount) {
  for (const [tier, expression] of Object.entries(pricingRules)) {
    const price = analyzer.evaluate(expression, { orderAmount });
    if (price !== null) {
      return { tier, price };
    }
  }
  return { tier: 'basic', price: orderAmount };
}

console.log(calculatePrice(75));   // { tier: 'basic', price: 75 }
console.log(calculatePrice(250));  // { tier: 'premium', price: 225 }
console.log(calculatePrice(600));  // { tier: 'enterprise', price: 480 }
```

## TypeScript Usage

```typescript
import { FEELAnalyzer, AnalysisResult } from 'feel-analyzer';

const analyzer = new FEELAnalyzer();

function analyzeFormula(formula: string): AnalysisResult {
  return analyzer.analyze(formula, { includeAst: false });
}

const result = analyzeFormula('x * y + z');

if (result.isValid) {
  console.log(`Expression type: ${result.type}`);
  console.log(`Variables needed: ${result.variables.join(', ')}`);
} else {
  console.error(`Invalid expression: ${result.error}`);
}
```

## Advanced Features

### Including AST

```javascript
const result = analyzer.analyze('x + y', { includeAst: true });
console.log(result.ast); // Lezer tree structure
```

### Type Determination

```javascript
const tests = [
  '5 + 3',                                    // number
  '"hello"',                                  // string
  'true and false',                           // boolean
  '[1, 2, 3]',                               // list
  'if x > 0 then "positive" else "negative"' // string
];

tests.forEach(expr => {
  const result = analyzer.analyze(expr);
  console.log(`${expr} => ${result.type}`);
});
```

## FEEL Language Basics

### Literals
- Numbers: `42`, `3.14`, `-10`
- Strings: `"hello"`, `"world"`
- Booleans: `true`, `false`
- Lists: `[1, 2, 3]`, `["a", "b", "c"]`

### Operators
- Arithmetic: `+`, `-`, `*`, `/`, `**` (power)
- Comparison: `<`, `<=`, `>`, `>=`, `=`, `!=`
- Logical: `and`, `or`, `not`

### Conditionals
```javascript
if condition then value1 else value2
```

### For Expressions
```javascript
for x in [1, 2, 3] return x * 2
// Result: [2, 4, 6]
```

### Built-in Functions
FEEL includes many built-in functions like:
- `sum([1, 2, 3])` => `6`
- `count([1, 2, 3])` => `3`
- `min([1, 2, 3])` => `1`
- `max([1, 2, 3])` => `3`

## Troubleshooting

### Variables Not Detected
The library uses heuristics to detect variables. If a variable isn't detected, it might be:
- Inside a string literal
- A FEEL keyword
- Part of a complex path expression

### Expression Always Valid
FEEL's parser is very permissive and accepts many inputs as valid. Use evaluation with a test context to check if an expression behaves as expected.

### Evaluation Errors
If evaluation fails, check:
- All required variables are in the context
- Variable names match exactly (case-sensitive)
- The expression syntax is correct FEEL

## Next Steps

- Read the [full documentation](./README.md)
- Explore [examples](./examples.js)
- Learn more about [FEEL](https://www.omg.org/spec/DMN/)
- Try the [FEEL Playground](https://nikku.github.io/feel-playground)

## Support

For issues and questions, please visit the [GitHub repository](https://github.com/bpmn-io/feel-analyzer).
