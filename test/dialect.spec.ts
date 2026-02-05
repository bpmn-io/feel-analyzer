import { expect } from 'chai';

import { FeelAnalyzer } from '../src/FeelAnalyzer.js';

describe('Parser Dialect and Built-ins', function() {
  let analyzer: FeelAnalyzer;

  beforeEach(function() {
    analyzer = new FeelAnalyzer();
  });

  describe('parserDialect', function() {
    it('should use camunda dialect by default', function() {
      const result = analyzer.analyze('x + y');

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'x', 'y' ]);
    });

    it('should support standard dialect', function() {
      const result = analyzer.analyze('x + y', {
        parserDialect: 'standard',
      });

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'x', 'y' ]);
    });
  });

  describe('builtins', function() {
    it('should filter out built-in functions from needed inputs', function() {
      const result = analyzer.analyze('string length(x)', {
        builtins: [
          {
            name: 'string length',
            type: 'function',
            params: [ { name: 'string' } ],
          },
        ],
      });

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'x' ]);
    });

    it('should filter out multiple built-in functions', function() {
      const result = analyzer.analyze('uuid() + " - " + trim(name)', {
        builtins: [
          {
            name: 'uuid',
            type: 'function',
            params: [],
          },
          {
            name: 'trim',
            type: 'function',
            params: [ { name: 'string' } ],
          },
        ],
      });

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'name' ]);
    });

    it('should work with complex expressions', function() {
      const result = analyzer.analyze(
        'count(items[item.price > min(prices.values)]) > 0',
        {
          builtins: [
            {
              name: 'count',
              type: 'function',
              params: [ { name: 'list' } ],
            },
            {
              name: 'min',
              type: 'function',
              params: [ { name: 'list' } ],
            },
          ],
        }
      );

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'items', 'prices.values' ]);
    });

    it('should handle built-ins with context access', function() {
      const result = analyzer.analyze('string length(user.name) > 5', {
        builtins: [
          {
            name: 'string length',
            type: 'function',
            params: [ { name: 'string' } ],
          },
        ],
      });

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'user.name' ]);
      expect(result.inputTypes).to.deep.equal({
        user: {
          type: 'context',
          properties: [ 'name' ],
        },
      });
    });

    it('should not filter non-builtin functions', function() {
      const result = analyzer.analyze('myFunction(x)', {
        builtins: [
          {
            name: 'otherFunction',
            type: 'function',
            params: [ { name: 'arg' } ],
          },
        ],
      });

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'myFunction', 'x' ]);
    });
  });

  describe('camunda dialect with builtins', function() {
    it('should work together', function() {
      const camundaBuiltins = [
        {
          name: 'is defined',
          type: 'function' as const,
          params: [ { name: 'value' } ],
        },
        {
          name: 'now',
          type: 'function' as const,
          params: [],
        },
      ];

      const result = analyzer.analyze('if is defined(x) then x else now()', {
        parserDialect: 'camunda',
        builtins: camundaBuiltins,
      });

      expect(result.valid).to.be.true;
      expect(result.neededInputs).to.deep.equal([ 'x' ]);
    });
  });
});
