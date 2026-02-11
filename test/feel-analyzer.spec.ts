import { expect } from 'chai';

import { FeelAnalyzer } from '../src/feel-analyzer';

describe('FeelAnalyzer', function () {
  let analyzer: FeelAnalyzer;
  let camundaAnalyzer: FeelAnalyzer;

  beforeEach(function () {
    analyzer = new FeelAnalyzer();
    camundaAnalyzer = new FeelAnalyzer({
      parserDialect: 'camunda',
      reservedNameBuiltins: [{ name: 'get or else' }],
    });

  });


  describe('feelAnalyzer', function () {

    it('should parse valid expression', function () {
      const result = analyzer.analyzeExpression('a + b');
      expect(result.valid).to.be.true;
    });


    it('should detect invalid expression', function () {
      const result = analyzer.analyzeExpression('a + ');
      expect(result.valid).to.be.false;
    });


    it('should not parse camunda reserved name builtins', function () {

      const result = analyzer.analyzeExpression('get or else(a, b)');
      expect(result.valid).to.be.false;
    });
  });


  describe('camundaAnalyzer', function () {

    it('should parse camunda reserved name builtins', function () {
      const result = camundaAnalyzer.analyzeExpression('get or else(a, b)');
      expect(result.valid).to.be.true;
    });


    it('should support backticks', function () {
      const result = camundaAnalyzer.analyzeExpression('`backtick`');
      expect(result.valid).to.be.true;
      expect(result.inputs).to.deep.equal({ backtick: { type: 'unknown' } });
    });

  });
});
