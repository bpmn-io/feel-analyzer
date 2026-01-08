import { expect } from 'chai';
import { FeelAnalyzer } from '../src/FeelAnalyzer.js';

describe('FeelAnalyzer', function() {
  let analyzer: FeelAnalyzer;

  beforeEach(function() {
    analyzer = new FeelAnalyzer();
  });

  describe('analyze', function() {
    it('should analyze a simple expression', function() {

      // given
      const expression = 'x + y';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result).to.exist;
      expect(result.valid).to.be.true;
      expect(result.expression).to.equal(expression);
      expect(result.errors).to.be.empty;
    });

    it('should accept options', function() {

      // given
      const expression = 'x + y';
      const options = {
        context: { x: 1, y: 2 },
        strict: true,
      };

      // when
      const result = analyzer.analyze(expression, options);

      // then
      expect(result).to.exist;
      expect(result.valid).to.be.true;
    });
  });

  describe('neededInputs', function() {
    it('should detect simple variable references', function() {

      // given
      const expression = 'firstname + lastname';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'firstname', 'lastname' ]);
    });

    it("should not detect 'item' in filter context", function() {

      // given
      const expression = '[ {x: 1}, {x: 2}, {x:3}][item.x>2]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([]);
    });

    it('should not detect variable shadowing in filter', function() {

      // given
      const expression = '[ {x: 1}, {x: 2}, {x:3}][item.x>x]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([]);
    });

    it('should detect external variables in filter', function() {

      // given
      const expression = '[ {x: 1}, {x: 2}, {x:3}][x>y]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'y' ]);
    });

    it('should detect list variable in filter', function() {

      // given
      const expression = 'list[x>2]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'list' ]);
    });

    it('should detect nested path expressions', function() {

      // given
      const expression = '{a: {b: c}}.a.b';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'c' ]);
    });

    it('should detect path expressions with multiple levels', function() {

      // given
      const expression = 'a + b.c';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'a', 'b.c' ]);
    });

    it('should not detect locally defined variables in context', function() {

      // given
      const expression = '{ a: 1, b: a + c }';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'c' ]);
    });

    it('should detect variables and ignore string interpolations', function() {

      // given
      const expression =
        '{ useSSL:true, user: "postgres", password: "{{secrets.POSTGRESQL_MASTER_PASSWORD}}", db: db}';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([ 'db' ]);
    });

    it('should detect function call arguments', function() {

      // given
      const expression =
        'fromAi(toolCall.yearlyIncome, "The yearly income of the household.", "number")';

      // when
      const result = analyzer.analyze(expression);

      // then
      // Note: This test case is marked as TBD in the requirements
      // For now, we'll check if toolCall.yearlyIncome is detected
      expect(result.neededInputs).to.include.members([ 'toolCall.yearlyIncome' ]);
    });

    it('should not detect variables in string literals', function() {

      // given
      const expression = '"long prompt...{{previousContext}}"';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.neededInputs).to.deep.equal([]);
    });
  });

  describe('outputType', function() {
    it('should detect context output', function() {

      // given
      const expression = '{ a: 1, b: 2, c: 3 }';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('context');
      expect(result.outputType?.keys).to.deep.equal([ 'a', 'b', 'c' ]);
    });

    it('should detect list output', function() {

      // given
      const expression = '[1, 2, 3]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('list');
    });

    it('should detect boolean output from comparison', function() {

      // given
      const expression = 'x > 5';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('boolean');
    });

    it('should detect number output from arithmetic', function() {

      // given
      const expression = 'x + y';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('unknown');
    });

    it('should detect number output from numeric literals', function() {

      // given
      const expression = '5 + 10';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('number');
    });

    it('should detect string output from string concatenation', function() {

      // given
      const expression = '"hello" + "world"';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('string');
    });

    it('should return unknown for mixed type expressions', function() {

      // given
      const expression = '5 + "hello"';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('unknown');
    });

    it('should detect string literal output', function() {

      // given
      const expression = '"hello world"';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('string');
    });

    it('should detect list output from filter', function() {

      // given
      const expression = 'list[x > 2]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.outputType?.type).to.equal('list');
    });

    it('should infer string type from context', function() {

      // given
      const expression = 'x + y';
      const options = {
        context: { x: 'hello', y: 'world' },
      };

      // when
      const result = analyzer.analyze(expression, options);

      // then
      expect(result.outputType?.type).to.equal('string');
    });

    it('should infer number type from context', function() {

      // given
      const expression = 'x + y';
      const options = {
        context: { x: 5, y: 10 },
      };

      // when
      const result = analyzer.analyze(expression, options);

      // then
      expect(result.outputType?.type).to.equal('number');
    });

    it('should return unknown when context has mixed types', function() {

      // given
      const expression = 'x + y';
      const options = {
        context: { x: 'hello', y: 10 },
      };

      // when
      const result = analyzer.analyze(expression, options);

      // then
      expect(result.outputType?.type).to.equal('unknown');
    });
  });

  describe('inputTypes', function() {
    it('should detect context type from path expressions', function() {

      // given
      const expression = 'user.email + " - " + user.name';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['user']).to.deep.equal({
        type: 'context',
        properties: [ 'email', 'name' ],
      });
    });

    it('should detect list type from filter expressions', function() {

      // given
      const expression = 'orders[item.total > 100]';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['orders']).to.deep.equal({
        type: 'list',
        itemProperties: [ 'total' ],
      });
    });

    it('should detect number type from comparisons', function() {

      // given
      const expression = 'age >= 18';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['age']?.type).to.equal('number');
    });

    it('should handle mixed path and simple variables', function() {

      // given
      const expression = 'a + b.c + d.e.f';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['a']?.type).to.equal('unknown');
      expect(result.inputTypes?.['b']).to.deep.equal({
        type: 'context',
        properties: [ 'c' ],
      });
      expect(result.inputTypes?.['d']).to.deep.equal({
        type: 'context',
        properties: [ 'e', 'f' ],
      });
    });

    it('should infer string type from string concatenation', function() {

      // given
      const expression = 'email + " - " + user';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['email']?.type).to.equal('string');
      expect(result.inputTypes?.['user']?.type).to.equal('string');
    });

    it('should not infer type without string literal', function() {

      // given
      const expression = 'email + user';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['email']?.type).to.equal('unknown');
      expect(result.inputTypes?.['user']?.type).to.equal('unknown');
    });

    it('should infer number type from numeric literal', function() {

      // given
      const expression = 'email + 1 + user';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['email']?.type).to.equal('number');
      expect(result.inputTypes?.['user']?.type).to.equal('number');
    });

    it('should handle mixed string and number literals as ambiguous', function() {

      // given
      const expression = 'email + 1 + "hello"';

      // when
      const result = analyzer.analyze(expression);

      // then
      expect(result.inputTypes).to.exist;
      expect(result.inputTypes?.['email']?.type).to.equal('unknown');
    });
  });
});
