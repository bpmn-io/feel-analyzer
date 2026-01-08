import { FeelAnalyzer } from "../../src/FeelAnalyzer.js";
import { testCases } from "./testCases";

export function TestCasesView() {
  const analyzer = new FeelAnalyzer();

  return (
    <div class="test-cases-container">
      <h2>Examples</h2>
      <p class="description">
        Quick overview of analyzer results for various FEEL expressions.
      </p>

      <div class="test-cases-table">
        <table>
          <thead>
            <tr>
              <th>Expression (given)</th>
              <th>Context (given)</th>
              <th>Needed Inputs (calculated)</th>
              <th>Output Type (calculated)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((testCase, index) => {
              const result = analyzer.analyze(testCase.expression, {
                context: testCase.context,
              });

              // Combine input names with their types (if not unknown)
              const inputsWithTypes =
                result.neededInputs?.map((input) => {
                  const rootVar = input.split(".")[0];
                  const type = result.inputTypes?.[rootVar];

                  if (!type || type.type === "unknown") {
                    return input;
                  }

                  if (type.type === "context" && type.properties) {
                    return `${rootVar}: context {${type.properties.join(
                      ", "
                    )}}`;
                  } else if (type.type === "list" && type.itemProperties) {
                    return `${rootVar}: list[{${type.itemProperties.join(
                      ", "
                    )}}]`;
                  } else {
                    return `${rootVar}: ${type.type}`;
                  }
                }) || [];

              // Deduplicate (e.g., if we have user.name and user.email, only show user: context once)
              const uniqueInputs = Array.from(
                new Map(
                  inputsWithTypes.map((input) => [
                    input.split(":")[0].trim(),
                    input,
                  ])
                ).values()
              );

              // Build playground URL with expression and context
              const playgroundUrl = (() => {
                const params = new URLSearchParams();
                params.set("expression", testCase.expression);

                // Build context string with given context and needed inputs
                let contextString = "";

                if (testCase.context) {
                  contextString += "// given context\n";
                  contextString += JSON.stringify(testCase.context, null, 2);
                }

                if (result.neededInputs && result.neededInputs.length > 0) {
                  // Filter out inputs that are already in the given context
                  const contextKeys = testCase.context
                    ? Object.keys(testCase.context)
                    : [];
                  const missingInputs = result.neededInputs.filter((input) => {
                    const rootVar = input.split(".")[0];
                    return !contextKeys.includes(rootVar);
                  });

                  if (missingInputs.length > 0) {
                    // Group inputs by root variable
                    const inputsByRoot = new Map<string, string[]>();
                    missingInputs.forEach((input) => {
                      const rootVar = input.split(".")[0];
                      if (!inputsByRoot.has(rootVar)) {
                        inputsByRoot.set(rootVar, []);
                      }
                      inputsByRoot.get(rootVar)!.push(input);
                    });

                    if (contextString) contextString += "\n\n";
                    contextString += "// needed inputs\n";
                    contextString += "{\n";

                    inputsByRoot.forEach((inputs, rootVar) => {
                      const type = result.inputTypes?.[rootVar];

                      // Check if any input has nested properties
                      const hasNestedProps = inputs.some((input) =>
                        input.includes(".")
                      );

                      if (hasNestedProps) {
                        // Create nested object structure
                        contextString += `  "${rootVar}": {\n`;
                        const properties = new Set(
                          inputs
                            .filter((input) => input.includes("."))
                            .map((input) => input.split(".").slice(1).join("."))
                        );
                        properties.forEach((prop) => {
                          contextString += `    "${prop}": "", // unknown\n`;
                        });
                        contextString += "  },\n";
                      } else {
                        // Simple value based on type
                        if (!type || type.type === "unknown") {
                          contextString += `  "${rootVar}": "", // unknown\n`;
                        } else if (type.type === "string") {
                          contextString += `  "${rootVar}": "",\n`;
                        } else if (type.type === "number") {
                          contextString += `  "${rootVar}": 0,\n`;
                        } else if (type.type === "boolean") {
                          contextString += `  "${rootVar}": false,\n`;
                        } else if (type.type === "context") {
                          contextString += `  "${rootVar}": {},\n`;
                        } else if (type.type === "list") {
                          contextString += `  "${rootVar}": [],\n`;
                        } else {
                          contextString += `  "${rootVar}": "", // ${type.type}\n`;
                        }
                      }
                    });

                    contextString += "}";
                  }
                }

                if (contextString) {
                  params.set("context", contextString);
                }

                return `#/?${params.toString()}`;
              })();

              return (
                <tr key={index}>
                  <td>
                    <div class="expression-cell">
                      {testCase.description && (
                        <span
                          class="info-icon-wrapper"
                          data-tooltip={testCase.description}
                        >
                          <svg
                            class="info-icon"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                          </svg>
                        </span>
                      )}
                      <code>{testCase.expression}</code>
                    </div>
                  </td>
                  <td>
                    {testCase.context ? (
                      <code class="context-code">
                        {JSON.stringify(testCase.context)}
                      </code>
                    ) : (
                      <span class="empty">—</span>
                    )}
                  </td>
                  <td>
                    {uniqueInputs.length > 0 ? (
                      <code class="inputs-code">{uniqueInputs.join(", ")}</code>
                    ) : (
                      <span class="empty">none</span>
                    )}
                  </td>
                  <td>
                    <code class="type-code">
                      {result.outputType?.type || "unknown"}
                      {result.outputType?.keys &&
                        ` {${result.outputType.keys.join(", ")}}`}
                    </code>
                  </td>
                  <td>
                    <a
                      href={playgroundUrl}
                      class="open-link"
                      title="Open in Playground"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                      </svg>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
