import { useState, useEffect } from "preact/hooks";
import JSON5 from "json5";
import { unaryTest, evaluate } from "feelin";
import { FeelAnalyzer } from "../../src/FeelAnalyzer.js";
import { parser } from "lezer-feel";
import { camundaBuiltins } from "@camunda/feel-builtins";

interface Warning {
  type: string;
  message: string;
}

interface EvaluationResult {
  result?: unknown;
  error?: string | null;
  warnings?: Warning[];
  duration?: number; // in milliseconds
}

interface PerformanceMetrics {
  analysisTime?: number;
  backendTime?: number;
  feelinTime?: number;
}

const STORAGE_KEY_BACKEND_URL = "feel-analyzer-backend-url";
const STORAGE_KEY_EXPRESSION_TYPE = "feel-analyzer-expression-type";
const STORAGE_KEY_EXPRESSION = "feel-analyzer-expression";
const STORAGE_KEY_UNARY_TEST_VALUE = "feel-analyzer-unary-test-value";
const STORAGE_KEY_CONTEXT = "feel-analyzer-context";
const STORAGE_KEY_ANALYSIS_COLLAPSED = "feel-analyzer-analysis-collapsed";
const STORAGE_KEY_SYNTAX_TREE_COLLAPSED = "feel-analyzer-syntax-tree-collapsed";
const STORAGE_KEY_BACKEND_COLLAPSED = "feel-analyzer-backend-collapsed";
const STORAGE_KEY_FEELIN_COLLAPSED = "feel-analyzer-feelin-collapsed";
const STORAGE_KEY_AUTO_UPDATE_CONTEXT = "feel-analyzer-auto-update-context";
const STORAGE_KEY_PARSER_DIALECT = "feel-analyzer-parser-dialect";
const STORAGE_KEY_USE_BUILTINS = "feel-analyzer-use-builtins";

/**
 * Format syntax tree for display
 */
function formatSyntaxTree(node: any, source: string, indent = ""): string {
  const text = source.substring(node.from, node.to);
  const displayText = text.length > 30 ? text.substring(0, 30) + "..." : text;
  let result = `${indent}${node.name}: ${JSON.stringify(displayText)}\n`;

  let child = node.firstChild;
  while (child) {
    result += formatSyntaxTree(child, source, indent + "  ");
    child = child.nextSibling;
  }

  return result;
}

interface PlaygroundProps {
  backendUrl: string;
  initialExpression?: string;
  initialContext?: string;
  initialExpressionType?: "expression" | "unaryTest";
  initialUnaryTestValue?: string;
}

export function Playground({
  backendUrl,
  initialExpression,
  initialContext,
  initialExpressionType,
  initialUnaryTestValue,
}: PlaygroundProps) {
  const [expressionType, setExpressionType] = useState<
    "expression" | "unaryTest"
  >(() => {
    if (initialExpressionType) return initialExpressionType;
    return (
      (localStorage.getItem(STORAGE_KEY_EXPRESSION_TYPE) as
        | "expression"
        | "unaryTest") || "expression"
    );
  });
  const [expression, setExpression] = useState(() => {
    if (initialExpression) return initialExpression;
    return localStorage.getItem(STORAGE_KEY_EXPRESSION) || "x + y";
  });
  const [unaryTestValue, setUnaryTestValue] = useState(() => {
    if (initialUnaryTestValue) return initialUnaryTestValue;
    return localStorage.getItem(STORAGE_KEY_UNARY_TEST_VALUE) || "";
  });
  const [context, setContext] = useState(() => {
    if (initialContext) return initialContext;
    return localStorage.getItem(STORAGE_KEY_CONTEXT) || "{\n    \n}";
  });
  const [syntaxTree, setSyntaxTree] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult>(
    {}
  );
  const [feelinResult, setFeelinResult] = useState<EvaluationResult>({});
  const [shareSuccess, setShareSuccess] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({});
  const [analysisCollapsed, setAnalysisCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ANALYSIS_COLLAPSED) === "true";
  });
  const [syntaxTreeCollapsed, setSyntaxTreeCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SYNTAX_TREE_COLLAPSED) === "true";
  });
  const [backendCollapsed, setBackendCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_BACKEND_COLLAPSED) === "true";
  });
  const [feelinCollapsed, setFeelinCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_FEELIN_COLLAPSED) === "true";
  });
  const [autoUpdateContext, setAutoUpdateContext] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AUTO_UPDATE_CONTEXT) === "true";
  });
  // Track which keys are managed by auto-update (Set of root variable names)
  const [autoManagedKeys, setAutoManagedKeys] = useState<Set<string>>(
    new Set()
  );
  const [parserDialect, setParserDialect] = useState<"standard" | "camunda">(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY_PARSER_DIALECT);
      return (stored as "standard" | "camunda") || "camunda";
    }
  );
  const [useBuiltins, setUseBuiltins] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY_USE_BUILTINS);
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BACKEND_URL, backendUrl);
  }, [backendUrl]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPRESSION_TYPE, expressionType);
  }, [expressionType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPRESSION, expression);
  }, [expression]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UNARY_TEST_VALUE, unaryTestValue);
  }, [unaryTestValue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONTEXT, context);
  }, [context]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_ANALYSIS_COLLAPSED,
      String(analysisCollapsed)
    );
  }, [analysisCollapsed]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_SYNTAX_TREE_COLLAPSED,
      String(syntaxTreeCollapsed)
    );
  }, [syntaxTreeCollapsed]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_BACKEND_COLLAPSED,
      String(backendCollapsed)
    );
  }, [backendCollapsed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FEELIN_COLLAPSED, String(feelinCollapsed));
  }, [feelinCollapsed]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_AUTO_UPDATE_CONTEXT,
      String(autoUpdateContext)
    );
  }, [autoUpdateContext]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PARSER_DIALECT, parserDialect);
  }, [parserDialect]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USE_BUILTINS, String(useBuiltins));
  }, [useBuiltins]);

  // Keep URL in sync with expression and context
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("expression", expression);
    if (context !== "{\n    \n}") {
      params.set("context", context);
    }
    if (expressionType !== "expression") {
      params.set("expressionType", expressionType);
    }
    if (expressionType === "unaryTest" && unaryTestValue) {
      params.set("unaryTestValue", unaryTestValue);
    }
    const newHash = `#/?${params.toString()}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, [expression, context, expressionType, unaryTestValue]);

  // Auto-update context by only updating auto-managed fields (if enabled)
  useEffect(() => {
    if (!autoUpdateContext) {
      return;
    }

    if (
      !analysisData ||
      !analysisData.neededInputs ||
      analysisData.neededInputs.length === 0
    ) {
      return;
    }

    try {
      // Parse existing context
      let contextObj: any = {};
      try {
        contextObj = JSON5.parse(context);
      } catch {
        // If context is invalid, start fresh
      }

      const contextKeys = Object.keys(contextObj);
      const neededRootVars = new Set(
        analysisData.neededInputs.map((input: string) => input.split(".")[0])
      );

      // Separate keys into user-managed and auto-managed
      const userManagedKeys = new Set(
        contextKeys.filter((key) => !autoManagedKeys.has(key))
      );

      // Build new context
      const newContext: any = {};
      const newAutoManagedKeys = new Set<string>();

      // 1. Preserve all user-managed keys with their values
      userManagedKeys.forEach((key) => {
        newContext[key] = contextObj[key];
      });

      // 2. Add/update auto-managed keys based on current analysis
      neededRootVars.forEach((rootVar) => {
        // If user has this key, keep it as user-managed
        if (userManagedKeys.has(rootVar)) {
          return;
        }

        // This is auto-managed
        newAutoManagedKeys.add(rootVar);

        const type = analysisData.inputTypes?.[rootVar];

        // Check if any input has nested properties
        const hasNestedProps = analysisData.neededInputs.some((input: string) =>
          input.startsWith(rootVar + ".")
        );

        if (hasNestedProps) {
          // Create nested object structure
          const nestedProps = analysisData.neededInputs
            .filter((i: string) => i.startsWith(rootVar + "."))
            .map((i: string) => i.split(".").slice(1).join("."));

          newContext[rootVar] = {};
          nestedProps.forEach((prop: string) => {
            newContext[rootVar][prop] = "";
          });
        } else {
          // Simple value based on type
          if (!type || type.type === "unknown") {
            newContext[rootVar] = "";
          } else if (type.type === "string") {
            newContext[rootVar] = "";
          } else if (type.type === "number") {
            newContext[rootVar] = 0;
          } else if (type.type === "boolean") {
            newContext[rootVar] = false;
          } else if (type.type === "context") {
            newContext[rootVar] = {};
          } else if (type.type === "list") {
            newContext[rootVar] = [];
          } else {
            newContext[rootVar] = "";
          }
        }
      });

      // Only update if something changed
      const newContextString = JSON.stringify(newContext, null, 2);
      if (newContextString !== JSON.stringify(contextObj, null, 2)) {
        setContext(newContextString);
        setAutoManagedKeys(newAutoManagedKeys);
      }
    } catch (error) {
      console.error("Error auto-updating context:", error);
    }
  }, [analysisData, autoUpdateContext, autoManagedKeys]);

  useEffect(() => {
    handleEvaluate();
  }, [expression, expressionType, unaryTestValue, context, backendUrl]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback: show the URL in an alert
      alert(`Share this URL:\n${url}`);
    }
  };

  const handleClearContext = () => {
    setContext("{\n    \n}");
    setAutoManagedKeys(new Set());
  };

  const handlePrefillContext = () => {
    if (
      !analysisData ||
      !analysisData.neededInputs ||
      analysisData.neededInputs.length === 0
    ) {
      return;
    }

    try {
      // Parse existing context
      let contextObj: any = {};
      try {
        contextObj = JSON5.parse(context);
      } catch {
        // If context is invalid, start fresh
      }

      // Filter out inputs already in context
      const contextKeys = Object.keys(contextObj);
      const missingInputs = analysisData.neededInputs.filter(
        (input: string) => {
          const rootVar = input.split(".")[0];
          return !contextKeys.includes(rootVar);
        }
      );

      if (missingInputs.length === 0) {
        return; // Nothing to add
      }

      // Group inputs by root variable
      const inputsByRoot = new Map<string, string[]>();
      missingInputs.forEach((input: string) => {
        const rootVar = input.split(".")[0];
        if (!inputsByRoot.has(rootVar)) {
          inputsByRoot.set(rootVar, []);
        }
        inputsByRoot.get(rootVar)!.push(input);
      });

      // Build the needed inputs section
      let contextString = "";

      // Keep existing context if any
      if (Object.keys(contextObj).length > 0) {
        contextString = "// given context\n";
        contextString += JSON.stringify(contextObj, null, 2);
        contextString += "\n\n";
      }

      // Add needed inputs
      contextString += "// needed inputs\n";
      contextString += "{\n";

      inputsByRoot.forEach((inputs, rootVar) => {
        const type = analysisData.inputTypes?.[rootVar];

        // Check if any input has nested properties
        const hasNestedProps = inputs.some((input: string) =>
          input.includes(".")
        );

        if (hasNestedProps) {
          // Create nested object structure
          contextString += `  "${rootVar}": {\n`;
          const properties = new Set(
            inputs
              .filter((input: string) => input.includes("."))
              .map((input: string) => input.split(".").slice(1).join("."))
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
      setContext(contextString);
      // Mark all added keys as auto-managed
      setAutoManagedKeys(new Set(inputsByRoot.keys()));
    } catch (error) {
      console.error("Error prefilling context:", error);
    }
  };

  const handleEvaluate = async () => {
    const metrics: PerformanceMetrics = {};

    // Analyze the expression with FEEL Analyzer
    try {
      const contextObj = JSON5.parse(context);
      const analyzer = new FeelAnalyzer();

      const analysisStart = performance.now();
      const analysis = analyzer.analyze(expression, {
        context: contextObj,
        parserDialect: parserDialect,
        builtins: useBuiltins ? camundaBuiltins : undefined,
      });
      metrics.analysisTime = performance.now() - analysisStart;

      // Display syntax tree with configured dialect
      const configuredParser =
        parserDialect === "standard"
          ? parser
          : parser.configure({ dialect: parserDialect });
      const tree = configuredParser.parse(expression);
      const treeStr = formatSyntaxTree(tree.topNode, expression);
      setSyntaxTree(treeStr);

      // Display analysis result
      const analysisStr = JSON.stringify(
        {
          valid: analysis.valid,
          neededInputs: analysis.neededInputs,
          inputTypes: analysis.inputTypes,
          outputType: analysis.outputType,
          errors: analysis.errors,
        },
        null,
        2
      );
      setAnalysisResult(analysisStr);
      setAnalysisData(analysis);
    } catch (error) {
      setSyntaxTree(`Error: ${error}`);
      setAnalysisResult(`Error: ${error}`);
      setAnalysisData(null);
    }

    // Evaluate with FEEL Scala Playground
    if (!backendUrl) {
      setEvaluationResult({
        error:
          "Backend not configured. Click '⚙️ Configure' to set up the FEEL Scala Playground backend.",
      });
    } else {
      try {
        const contextObj = JSON5.parse(context);

        let endpoint: string;
        let payload: any;

        if (expressionType === "unaryTest") {
          endpoint = `${backendUrl}/api/v1/feel-unary-tests/evaluate`;
          payload = {
            expression,
            inputValue: unaryTestValue,
            context: contextObj,
            metadata: { source: "playground" },
          };
        } else {
          endpoint = `${backendUrl}/api/v1/feel/evaluate`;
          payload = {
            expression,
            context: contextObj,
            metadata: { source: "playground" },
          };
        }

        const backendStart = performance.now();
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        metrics.backendTime = performance.now() - backendStart;

        setEvaluationResult({
          result: data.result,
          error: data.error,
          warnings: data.warnings || [],
          duration: metrics.backendTime,
        });
      } catch (error) {
        setEvaluationResult({ error: String(error) });
      }
    }

    // Evaluate with feelin
    try {
      const contextObj = JSON5.parse(context);
      let feelinResultValue;

      const feelinStart = performance.now();
      if (expressionType === "unaryTest") {
        feelinResultValue = unaryTest(expression, unaryTestValue, contextObj);
      } else {
        feelinResultValue = evaluate(expression, contextObj);
      }
      metrics.feelinTime = performance.now() - feelinStart;

      setFeelinResult({
        result: feelinResultValue,
        error: null,
        duration: metrics.feelinTime,
      });
    } catch (error) {
      setFeelinResult({ error: String(error) });
    }

    setPerformanceMetrics(metrics);
  };

  return (
    <>
      <div class="layout">
        <div class="input-panel">
          <div class="panel-header">
            <h2>Input</h2>
            <button
              onClick={handleShare}
              class="btn-share"
              title="Copy shareable link to clipboard"
            >
              {shareSuccess ? "✓ Copied!" : "🔗 Share"}
            </button>
          </div>

          <div class="form-group">
            <label>
              Expression Type:
              <select
                value={expressionType}
                onChange={(e) =>
                  setExpressionType(
                    (e.target as HTMLSelectElement).value as any
                  )
                }
              >
                <option value="expression">Expression</option>
                <option value="unaryTest">Unary Test</option>
              </select>
            </label>
          </div>

          <div class="form-group">
            <label>
              Parser Dialect:
              <select
                value={parserDialect}
                onChange={(e) =>
                  setParserDialect((e.target as HTMLSelectElement).value as any)
                }
              >
                <option value="camunda">Camunda</option>
                <option value="standard">Standard</option>
              </select>
            </label>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input
                type="checkbox"
                checked={useBuiltins}
                onChange={(e) =>
                  setUseBuiltins((e.target as HTMLInputElement).checked)
                }
              />
              <span>Use Camunda Built-ins</span>
            </label>
            {useBuiltins && (
              <div style="font-size: 0.85em; color: #666; margin-top: 4px; padding-left: 24px;">
                Functions like uuid(), trim(), etc. will be filtered from needed
                inputs
              </div>
            )}
          </div>

          <div class="form-group">
            <label>
              Expression:
              <textarea
                value={expression}
                onInput={(e) =>
                  setExpression((e.target as HTMLTextAreaElement).value)
                }
                rows={3}
              />
            </label>
          </div>

          {expressionType === "unaryTest" && (
            <div class="form-group">
              <label>
                Input Value:
                <input
                  type="text"
                  value={unaryTestValue}
                  onInput={(e) =>
                    setUnaryTestValue((e.target as HTMLInputElement).value)
                  }
                  placeholder="e.g., 5"
                />
              </label>
            </div>
          )}

          <div class="form-group">
            <label>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span>Context (JSON5):</span>
                <label style="display: flex; align-items: center; gap: 4px; font-size: 0.9em; font-weight: normal; cursor: pointer;">
                  <input
                    type="checkbox"
                    checked={autoUpdateContext}
                    onChange={(e) =>
                      setAutoUpdateContext(
                        (e.target as HTMLInputElement).checked
                      )
                    }
                  />
                  Auto-update
                </label>
              </div>
              <textarea
                value={context}
                onInput={(e) => {
                  const newContext = (e.target as HTMLTextAreaElement).value;
                  setContext(newContext);
                  // When user manually edits, mark all current keys as user-managed
                  try {
                    const parsed = JSON5.parse(newContext);
                    const allKeys = Object.keys(parsed);
                    // Remove all keys from auto-managed (user is now in control)
                    setAutoManagedKeys(new Set());
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={8}
              />
            </label>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button
                onClick={handleClearContext}
                class="btn-secondary"
                style="flex: 1;"
                title="Clear context"
              >
                🗑️ Clear
              </button>
              {analysisData &&
                analysisData.neededInputs &&
                analysisData.neededInputs.length > 0 && (
                  <button
                    onClick={handlePrefillContext}
                    class="btn-secondary"
                    style="flex: 1;"
                    title="Add missing inputs to context based on analysis"
                  >
                    ➕ Prefill Needed Inputs
                  </button>
                )}
            </div>
          </div>
        </div>

        <div class="output-panel">
          <h2>Output</h2>

          <div class="output-section">
            <h3
              class="collapsible-header"
              onClick={() => setAnalysisCollapsed(!analysisCollapsed)}
            >
              <span class="collapse-icon">{analysisCollapsed ? "▶" : "▼"}</span>
              Analysis Result{" "}
              {performanceMetrics.analysisTime !== undefined && (
                <span class="perf-badge">
                  {performanceMetrics.analysisTime.toFixed(2)}ms
                </span>
              )}
            </h3>
            {!analysisCollapsed && (
              <pre>{analysisResult || "// Waiting for input..."}</pre>
            )}
          </div>

          <div class="output-section">
            <h3
              class="collapsible-header"
              onClick={() => setSyntaxTreeCollapsed(!syntaxTreeCollapsed)}
            >
              <span class="collapse-icon">
                {syntaxTreeCollapsed ? "▶" : "▼"}
              </span>
              Syntax Tree
            </h3>
            {!syntaxTreeCollapsed && (
              <pre>{syntaxTree || "// Waiting for input..."}</pre>
            )}
          </div>

          <div class="output-section">
            <h3
              class="collapsible-header"
              onClick={() => setBackendCollapsed(!backendCollapsed)}
            >
              <span class="collapse-icon">{backendCollapsed ? "▶" : "▼"}</span>
              Evaluation Result (FEEL Scala Playground){" "}
              {performanceMetrics.backendTime !== undefined && (
                <span class="perf-badge">
                  {performanceMetrics.backendTime.toFixed(2)}ms
                </span>
              )}
            </h3>
            {!backendCollapsed && (
              <>
                {evaluationResult.warnings &&
                  evaluationResult.warnings.length > 0 && (
                    <div class="warnings">
                      {evaluationResult.warnings.map((warning, index) => (
                        <div key={index} class="warning-item">
                          <strong>{warning.type}:</strong> {warning.message}
                        </div>
                      ))}
                    </div>
                  )}
                <pre>
                  {evaluationResult.error
                    ? `Error: ${evaluationResult.error}`
                    : evaluationResult.result !== undefined
                    ? JSON.stringify(evaluationResult.result, null, 2)
                    : "// Waiting for input..."}
                </pre>
              </>
            )}
          </div>

          <div class="output-section">
            <h3
              class="collapsible-header"
              onClick={() => setFeelinCollapsed(!feelinCollapsed)}
            >
              <span class="collapse-icon">{feelinCollapsed ? "▶" : "▼"}</span>
              Evaluation Result (feelin){" "}
              {performanceMetrics.feelinTime !== undefined && (
                <span class="perf-badge">
                  {performanceMetrics.feelinTime.toFixed(2)}ms
                </span>
              )}
            </h3>
            {!feelinCollapsed && (
              <>
                {feelinResult.warnings && feelinResult.warnings.length > 0 && (
                  <div class="warnings">
                    {feelinResult.warnings.map((warning, index) => (
                      <div key={index} class="warning-item">
                        <strong>{warning.type}:</strong> {warning.message}
                      </div>
                    ))}
                  </div>
                )}
                <pre>
                  {feelinResult.error
                    ? `Error: ${feelinResult.error}`
                    : feelinResult.result !== undefined
                    ? JSON.stringify(feelinResult.result, null, 2)
                    : "// Waiting for input..."}
                </pre>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
