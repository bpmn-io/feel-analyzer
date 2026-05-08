import { expect } from 'chai';

import { FeelAnalyzer } from '../src/feel-analyzer';

describe('functions', function () {

  let analyzer: FeelAnalyzer;
  let camundaAnalyzer: FeelAnalyzer;

  beforeEach(function () {
    analyzer = new FeelAnalyzer();
    camundaAnalyzer = new FeelAnalyzer({
      parserDialect: 'camunda',
      builtins: [
        { name: 'sum' },
        { name: 'count' },
        { name: 'contains' },
        { name: 'from json' },
        { name: 'get or else' },
        { name: 'string length' },
      ],
      reservedNameBuiltins: [
        { name: 'from json' },
        { name: 'get or else' },
        { name: 'string length' },
      ],
    });
  });


  it('should extract a single function call', function () {

    // when
    const result = analyzer.analyzeExpression('sum(x)');

    // then
    expect(result.functions).to.deep.equal([
      { name: 'sum', type: 'user' },
    ]);
  });


  it('should extract nested function calls', function () {

    // when
    const result = analyzer.analyzeExpression('sum(count(x))');

    // then
    expect(result.functions).to.deep.equal([
      { name: 'count', type: 'user' },
      { name: 'sum', type: 'user' },
    ]);
  });


  it('should return empty array for expressions without function calls', function () {

    // when
    const result = analyzer.analyzeExpression('x + y');

    // then
    expect(result.functions).to.deep.equal([]);
  });


  it('should deduplicate repeated function calls', function () {

    // when
    const result = analyzer.analyzeExpression('sum(a) + sum(b)');

    // then
    expect(result.functions).to.deep.equal([
      { name: 'sum', type: 'user' },
    ]);
  });


  it('should extract functions from complex expressions', function () {

    // when
    const result = analyzer.analyzeExpression('if contains(x, "a") then sum(y) else count(z)');

    // then
    expect(result.functions).to.deep.equal([
      { name: 'contains', type: 'user' },
      { name: 'count', type: 'user' },
      { name: 'sum', type: 'user' },
    ]);
  });


  it('should extract functions inside for expressions', function () {

    // when
    const result = analyzer.analyzeExpression('for i in list return sum(i)');

    // then
    expect(result.functions).to.deep.equal([
      { name: 'sum', type: 'user' },
    ]);
  });


  it('should extract functions inside filter expressions', function () {

    // when
    const result = analyzer.analyzeExpression('items[contains(name, "a")]');

    // then
    expect(result.functions).to.deep.equal([
      { name: 'contains', type: 'user' },
    ]);
  });


  describe('camunda dialect', function () {

    it('should extract multi-word function calls', function () {

      // when
      const result = camundaAnalyzer.analyzeExpression('from json(x)');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'from json', type: 'builtin' },
      ]);
    });


    it('should extract mixed single and multi-word functions', function () {

      // when
      const result = camundaAnalyzer.analyzeExpression('from json(sum(x))');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'from json', type: 'builtin' },
        { name: 'sum', type: 'builtin' },
      ]);
    });


    it('should extract multiple multi-word functions', function () {

      // when
      const result = camundaAnalyzer.analyzeExpression('get or else(from json(x), "default")');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'from json', type: 'builtin' },
        { name: 'get or else', type: 'builtin' },
      ]);
    });


    it('should mark user-defined functions alongside builtins', function () {

      // when
      const result = camundaAnalyzer.analyzeExpression('sum(myHelper(x))');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'myHelper', type: 'user' },
        { name: 'sum', type: 'builtin' },
      ]);
    });
  });


  describe('shadowing', function () {

    let shadowingAnalyzer: FeelAnalyzer;

    beforeEach(function () {
      shadowingAnalyzer = new FeelAnalyzer({
        builtins: [ { name: 'sum' } ],
      });
    });


    it('should mark builtin shadowed by function parameter as user', function () {

      // when
      const result = shadowingAnalyzer.analyzeExpression('function(sum) sum(5)');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'sum', type: 'user' },
      ]);
    });


    it('should mark builtin shadowed by context entry as user', function () {

      // when
      const result = shadowingAnalyzer.analyzeExpression('{sum: function(x) x + 1, result: sum(5)}');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'sum', type: 'user' },
      ]);
    });


    it('should mark builtin shadowed by for iterator as user', function () {

      // when
      const result = shadowingAnalyzer.analyzeExpression('for sum in [function(x) x] return sum(5)');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'sum', type: 'user' },
      ]);
    });


    it('should mark builtin shadowed by some quantifier as user', function () {

      // when
      const result = shadowingAnalyzer.analyzeExpression('some sum in [function(x) x] satisfies sum(5) = 5');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'sum', type: 'user' },
      ]);
    });


    it('should mark builtin shadowed by every quantifier as user', function () {

      // when
      const result = shadowingAnalyzer.analyzeExpression('every sum in [function(x) x] satisfies sum(5) = 5');

      // then
      expect(result.functions).to.deep.equal([
        { name: 'sum', type: 'user' },
      ]);
    });
  });
});
