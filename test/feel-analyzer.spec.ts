import { expect } from 'chai';

import { FeelAnalyzer } from '../src/feel-analyzer';

describe('FeelAnalyzer', function () {
  let analyzer: FeelAnalyzer;

  beforeEach(function () {
    analyzer = new FeelAnalyzer();
  });

  describe('analyzeExpression', function () {
    it('should parse valid expression', function () {
      const result = analyzer.analyzeExpression('a + b');
      expect(result.valid).to.be.true;
    });

    it('should detect invalid expression', function () {
      const result = analyzer.analyzeExpression('a + ');
      expect(result.valid).to.be.false;
    });
  });
});
