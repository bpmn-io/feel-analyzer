import { parser } from '@bpmn-io/lezer-feel';

export class FeelAnalyzer {
  analyzeExpression(expression: string) {
    const tree = parser.parse(expression);

    const result = {
      valid: true,
    };

    tree.iterate({
      enter(syntaxNodeRef) {
        const { isError } = syntaxNodeRef.type;

        if (isError) {
          result.valid = false;
        }
      },
    });

    return result;
  }
}
