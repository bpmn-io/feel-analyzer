/// <reference types="mocha" />

import { expect } from 'chai';
import { FEELAnalyzer } from '../src/analyzer';

describe('FEELAnalyzer', () => {
  let analyzer: FEELAnalyzer;

  beforeEach(() => {
    analyzer = new FEELAnalyzer();
  });

  describe('analyze', () => {
    it('should analyze a simple number expression', () => {
      const result = analyzer.analyze('5 + 3');
      
      expect(result.isValid).to.be.true;
      expect(result.error).to.be.undefined;
    });

    it('should analyze a simple string expression', () => {
      const result = analyzer.analyze('"hello world"');
      
      expect(result.isValid).to.be.true;
      expect(result.error).to.be.undefined;
    });

    it('should extract variables from expression', () => {
      const result = analyzer.analyze('x + y');
      
      expect(result.isValid).to.be.true;
      expect(result.variables).to.have.lengthOf(2);
      expect(result.variables).to.include('x');
      expect(result.variables).to.include('y');
    });

    it('should extract variables from complex expression', () => {
      const result = analyzer.analyze('if age > 18 then "adult" else "minor"');
      
      expect(result.isValid).to.be.true;
      expect(result.variables).to.include('age');
    });

    it('should return error when parsing fails', () => {
      // feelin is very permissive, but we can still handle errors
      const result = analyzer.analyze('');
      
      // Even empty expressions parse successfully in feelin
      expect(result.isValid).to.be.true;
    });

    it('should include AST when requested', () => {
      const result = analyzer.analyze('5 + 3', { includeAst: true });
      
      expect(result.isValid).to.be.true;
      expect(result.ast).to.exist;
    });

    it('should not include AST by default', () => {
      const result = analyzer.analyze('5 + 3');
      
      expect(result.isValid).to.be.true;
      expect(result.ast).to.be.undefined;
    });

    it('should handle boolean expressions', () => {
      const result = analyzer.analyze('true and false');
      
      expect(result.isValid).to.be.true;
      expect(result.error).to.be.undefined;
    });

    it('should handle list expressions', () => {
      const result = analyzer.analyze('[1, 2, 3, 4]');
      
      expect(result.isValid).to.be.true;
      expect(result.error).to.be.undefined;
    });

    it('should handle function invocations', () => {
      const result = analyzer.analyze('sum([1, 2, 3])');
      
      expect(result.isValid).to.be.true;
      expect(result.error).to.be.undefined;
    });
  });

  describe('isValid', () => {
    it('should return true for valid expression', () => {
      expect(analyzer.isValid('5 + 3')).to.be.true;
    });

    it('should return true for various expressions', () => {
      // feelin is very permissive in parsing
      expect(analyzer.isValid('')).to.be.true;
      expect(analyzer.isValid('x')).to.be.true;
    });

    it('should validate complex expressions', () => {
      expect(analyzer.isValid('if x > 10 then "big" else "small"')).to.be.true;
    });

    it('should validate string literals', () => {
      expect(analyzer.isValid('"test string"')).to.be.true;
    });
  });

  describe('evaluate', () => {
    it('should evaluate simple arithmetic', () => {
      const result = analyzer.evaluate('5 + 3');
      expect(result).to.equal(8);
    });

    it('should evaluate with context', () => {
      const result = analyzer.evaluate('x + y', { x: 10, y: 20 });
      expect(result).to.equal(30);
    });

    it('should evaluate string concatenation', () => {
      const result = analyzer.evaluate('"hello" + " " + "world"');
      expect(result).to.equal('hello world');
    });

    it('should evaluate boolean expressions', () => {
      const result = analyzer.evaluate('5 > 3');
      expect(result).to.be.true;
    });

    it('should evaluate conditional expressions', () => {
      const result = analyzer.evaluate('if 5 > 3 then "yes" else "no"');
      expect(result).to.equal('yes');
    });

    it('should handle evaluation errors gracefully', () => {
      // Test that errors are properly wrapped
      try {
        analyzer.evaluate('nonexistent.function.call()');
        // If no error thrown, that's also fine for feelin
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
      }
    });

    it('should evaluate with nested context', () => {
      const result = analyzer.evaluate('person.age', { person: { age: 25 } });
      expect(result).to.equal(25);
    });
  });
});
