const { expect } = require('chai');

const { FeelAnalyzer } = require('@bpmn-io/feel-analyzer');


describe('feel-analyzer - use from commonjs', function() {

  it('should expose FeelAnalyzer', function() {

    // when
    const analyzer = new FeelAnalyzer();
    const result = analyzer.analyzeExpression('a + b');

    // then
    expect(result).to.have.property('inputs');
  });

});
