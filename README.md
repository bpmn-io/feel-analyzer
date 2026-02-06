# FEEL Analyzer

> A library for analyzing FEEL (Friendly Enough Expression Language) expressions.

[![CI](https://github.com/bpmn-io/feel-analyzer/workflows/CI/badge.svg)](https://github.com/bpmn-io/feel-analyzer/actions?query=workflow%3ACI)

## Installation

```bash
npm install @bpmn-io/feel-analyzer
```

## Usage

### Basic Example

```javascript
import { FeelAnalyzer } from '@bpmn-io/feel-analyzer';

const analyzer = new FeelAnalyzer();

const result = analyzer.analyzeExpression('x + y');

console.log(result.valid); // true
```

## Related

- [@bpmn-io/lezer-feel](https://github.com/bpmn-io/lezer-feel) - FEEL language definition for the [Lezer](https://lezer.codemirror.net/) parser system

## License

MIT
