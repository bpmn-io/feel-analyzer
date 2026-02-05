import { analyzeExpression } from './src/index.ts';

const result = analyzeExpression('`test tst` + 1');

console.log('Result:', JSON.stringify(result, null, 2));
console.log('\nNeeded inputs:', result.neededInputs);
