import { expect } from 'chai';
import { FeelAnalyzer } from '../src/FeelAnalyzer.js';
import { testCases } from '../playground/src/testCases.js';

describe('Test Cases from playground', function() {
  let analyzer: FeelAnalyzer;

  beforeEach(function() {
    analyzer = new FeelAnalyzer();
  });

  testCases.forEach((testCase, index) => {
    describe(`Test Case #${index + 1}: ${testCase.description}`, function() {
      it('should analyze correctly', function() {

        // given
        const { expression, context, expected } = testCase;

        // when
        const result = analyzer.analyze(
          expression,
          context ? { context } : undefined
        );

        // then
        expect(result.valid).to.be.true;
        expect(result.errors).to.be.empty;

        if (expected) {

          // Check neededInputs
          if (expected.neededInputs !== undefined) {
            expect(result.neededInputs).to.deep.equal(
              expected.neededInputs,
              `neededInputs mismatch for: ${expression}`
            );
          }

          // Check inputTypes
          if (expected.inputTypes !== undefined) {
            expect(result.inputTypes).to.deep.equal(
              expected.inputTypes,
              `inputTypes mismatch for: ${expression}`
            );
          }

          // Check outputType
          if (expected.outputType !== undefined) {
            expect(result.outputType).to.deep.equal(
              expected.outputType,
              `outputType mismatch for: ${expression}`
            );
          }
        }
      });
    });
  });

  it('should have test cases defined', function() {
    expect(testCases).to.be.an('array');
    expect(testCases.length).to.be.greaterThan(0);
  });

  it('should have expected outcomes for all test cases', function() {
    const casesWithoutExpected = testCases.filter((tc) => !tc.expected);
    expect(casesWithoutExpected).to.be.empty;
  });
});
