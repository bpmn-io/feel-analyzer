/**
 * Example usage of feel-analyzer
 */

const { FEELAnalyzer } = require('./dist/index');

// Create analyzer instance
const analyzer = new FEELAnalyzer();

console.log('=== FEEL Analyzer Examples ===\n');

// Example 1: Simple arithmetic
console.log('1. Simple Arithmetic');
const expr1 = '5 + 3 * 2';
const result1 = analyzer.analyze(expr1);
console.log(`Expression: ${expr1}`);
console.log(`Valid: ${result1.isValid}`);
console.log(`Type: ${result1.type}`);
console.log(`Result: ${analyzer.evaluate(expr1)}`);
console.log();

// Example 2: Variable extraction
console.log('2. Variable Extraction');
const expr2 = 'x + y * z';
const result2 = analyzer.analyze(expr2);
console.log(`Expression: ${expr2}`);
console.log(`Variables: ${result2.variables.join(', ')}`);
console.log(`With context {x:10, y:5, z:2}: ${analyzer.evaluate(expr2, { x: 10, y: 5, z: 2 })}`);
console.log();

// Example 3: Conditional expressions
console.log('3. Conditional Expressions');
const expr3 = 'if age >= 18 then "adult" else "minor"';
const result3 = analyzer.analyze(expr3);
console.log(`Expression: ${expr3}`);
console.log(`Variables: ${result3.variables.join(', ')}`);
console.log(`With age=25: ${analyzer.evaluate(expr3, { age: 25 })}`);
console.log(`With age=15: ${analyzer.evaluate(expr3, { age: 15 })}`);
console.log();

// Example 4: String operations
console.log('4. String Operations');
const expr4 = '"Hello" + " " + "World"';
const result4 = analyzer.analyze(expr4);
console.log(`Expression: ${expr4}`);
console.log(`Result: ${analyzer.evaluate(expr4)}`);
console.log();

// Example 5: List operations
console.log('5. List Operations');
const expr5 = '[1, 2, 3, 4, 5]';
const result5 = analyzer.analyze(expr5);
console.log(`Expression: ${expr5}`);
console.log(`Type: ${result5.type}`);
console.log(`Result: ${JSON.stringify(analyzer.evaluate(expr5))}`);
console.log();

// Example 6: Complex business rule
console.log('6. Complex Business Rule');
const expr6 = 'if score >= 90 then "A" else if score >= 80 then "B" else if score >= 70 then "C" else "F"';
const result6 = analyzer.analyze(expr6);
console.log(`Expression: ${expr6}`);
console.log(`Variables: ${result6.variables.join(', ')}`);
console.log(`With score=95: ${analyzer.evaluate(expr6, { score: 95 })}`);
console.log(`With score=85: ${analyzer.evaluate(expr6, { score: 85 })}`);
console.log(`With score=75: ${analyzer.evaluate(expr6, { score: 75 })}`);
console.log(`With score=65: ${analyzer.evaluate(expr6, { score: 65 })}`);
console.log();

// Example 7: Boolean logic
console.log('7. Boolean Logic');
const expr7 = 'isActive and (age >= 18 or hasPermission)';
const result7 = analyzer.analyze(expr7);
console.log(`Expression: ${expr7}`);
console.log(`Variables: ${result7.variables.join(', ')}`);
console.log(`With {isActive:true, age:20, hasPermission:false}: ${analyzer.evaluate(expr7, { isActive: true, age: 20, hasPermission: false })}`);
console.log(`With {isActive:true, age:16, hasPermission:true}: ${analyzer.evaluate(expr7, { isActive: true, age: 16, hasPermission: true })}`);
console.log();

// Example 8: Validation
console.log('8. Validation');
const validExpr = 'x + y';
const emptyExpr = '';
console.log(`"${validExpr}" is valid: ${analyzer.isValid(validExpr)}`);
console.log(`"${emptyExpr}" is valid: ${analyzer.isValid(emptyExpr)}`);
console.log();

console.log('=== Examples Complete ===');
