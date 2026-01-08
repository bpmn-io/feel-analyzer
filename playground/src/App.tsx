import { useState, useEffect } from "preact/hooks";
import JSON5 from "json5";
import { unaryTest, evaluate } from "feelin";
import { FeelAnalyzer } from "../../src/FeelAnalyzer.js";
import { parser } from "lezer-feel";
import { TestCasesView } from "./TestCasesView";

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

const STORAGE_KEY = "feel-analyzer-backend-url";
const STORAGE_KEY_EXPRESSION_TYPE = "feel-analyzer-expression-type";
const STORAGE_KEY_EXPRESSION = "feel-analyzer-expression";
const STORAGE_KEY_UNARY_TEST_VALUE = "feel-analyzer-unary-test-value";
const STORAGE_KEY_CONTEXT = "feel-analyzer-context";
const STORAGE_KEY_ANALYSIS_COLLAPSED = "feel-analyzer-analysis-collapsed";
const STORAGE_KEY_SYNTAX_TREE_COLLAPSED = "feel-analyzer-syntax-tree-collapsed";
const STORAGE_KEY_BACKEND_COLLAPSED = "feel-analyzer-backend-collapsed";
const STORAGE_KEY_FEELIN_COLLAPSED = "feel-analyzer-feelin-collapsed";

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

export function App() {
  // Use hash-based routing for GitHub Pages compatibility
  const getRoute = () => {
    const hash = window.location.hash.slice(1) || "/";
    return hash.startsWith("/examples") ? "examples" : "playground";
  };

  // Parse URL parameters from hash
  const getUrlParams = () => {
    const hash = window.location.hash.slice(1);
    const queryIndex = hash.indexOf("?");
    if (queryIndex === -1) return null;

    const params = new URLSearchParams(hash.slice(queryIndex + 1));
    return {
      expression: params.get("expression"),
      context: params.get("context"),
      expressionType: params.get("expressionType"),
      unaryTestValue: params.get("unaryTestValue"),
    };
  };

  const [route, setRoute] = useState<"playground" | "examples">(getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = getRoute();
      setRoute(newRoute);

      // Load example from URL if navigating to playground
      if (newRoute === "playground") {
        const params = getUrlParams();
        if (params?.expression) {
          setExpression(decodeURIComponent(params.expression));
        }
        if (params?.context) {
          setContext(decodeURIComponent(params.context));
        }
        if (params?.expressionType) {
          setExpressionType(
            params.expressionType as "expression" | "unaryTest"
          );
        }
        if (params?.unaryTestValue) {
          setUnaryTestValue(decodeURIComponent(params.unaryTestValue));
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  const [showConfig, setShowConfig] = useState(false);
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [tempBackendUrl, setTempBackendUrl] = useState(backendUrl);
  const [expressionType, setExpressionType] = useState<
    "expression" | "unaryTest"
  >(() => {
    const params = getUrlParams();
    if (params?.expressionType) {
      return params.expressionType as "expression" | "unaryTest";
    }
    return (
      (localStorage.getItem(STORAGE_KEY_EXPRESSION_TYPE) as
        | "expression"
        | "unaryTest") || "expression"
    );
  });
  const [expression, setExpression] = useState(() => {
    const params = getUrlParams();
    if (params?.expression) {
      return decodeURIComponent(params.expression);
    }
    return localStorage.getItem(STORAGE_KEY_EXPRESSION) || "x + y";
  });
  const [unaryTestValue, setUnaryTestValue] = useState(() => {
    const params = getUrlParams();
    if (params?.unaryTestValue) {
      return decodeURIComponent(params.unaryTestValue);
    }
    return localStorage.getItem(STORAGE_KEY_UNARY_TEST_VALUE) || "";
  });
  const [context, setContext] = useState(() => {
    const params = getUrlParams();
    if (params?.context) {
      return decodeURIComponent(params.context);
    }
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, backendUrl);
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

  // Keep URL in sync with expression and context
  useEffect(() => {
    if (route === "playground") {
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
    }
  }, [expression, context, expressionType, unaryTestValue, route]);

  useEffect(() => {
    handleEvaluate();
  }, [expression, expressionType, unaryTestValue, context, backendUrl]);

  const handleSaveConfig = () => {
    setBackendUrl(tempBackendUrl);
    setShowConfig(false);
  };

  const handleCancelConfig = () => {
    setTempBackendUrl(backendUrl);
    setShowConfig(false);
  };

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
      const analysis = analyzer.analyze(expression, { context: contextObj });
      metrics.analysisTime = performance.now() - analysisStart;

      // Display syntax tree
      const tree = parser.parse(expression);
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
    <div class="container">
      <header>
        <h1>FEEL Analyzer Playground</h1>
        <div class="header-actions">
          <nav class="tabs">
            <a
              href="#/"
              class={`tab ${route === "playground" ? "active" : ""}`}
            >
              Playground
            </a>
            <a
              href="#/examples"
              class={`tab ${route === "examples" ? "active" : ""}`}
            >
              Examples
            </a>
          </nav>
          <button onClick={() => setShowConfig(!showConfig)} class="btn-config">
            ⚙️ Configure
          </button>
        </div>
      </header>

      {showConfig && (
        <div class="config-panel">
          <h2>Configuration</h2>

          <div class="setup-instructions">
            <h3>🐳 Setup FEEL Scala Playground</h3>
            <p>
              To enable backend evaluation, start the FEEL Scala Playground
              using Docker:
            </p>
            <pre class="code-block">
              docker run -e JAVA_OPTS="-Dplayground.tracking.enabled=false" -e
              MIXPANEL_PROJECT_TOKEN=false -p 8123:8080
              ghcr.io/camunda-community-hub/feel-scala-playground:1.3.9
            </pre>
            <p>
              Then set the backend URL below to{" "}
              <code>http://localhost:8123</code>
            </p>
          </div>

          <div class="form-group">
            <label>
              Backend URL:
              <input
                type="text"
                value={tempBackendUrl}
                onInput={(e) =>
                  setTempBackendUrl((e.target as HTMLInputElement).value)
                }
                placeholder="e.g., http://localhost:8123"
              />
            </label>
            <small>
              The URL of the FEEL Scala Playground backend (optional)
            </small>
          </div>
          <div class="config-actions">
            <button onClick={handleSaveConfig} class="btn-primary">
              Save
            </button>
            <button onClick={handleCancelConfig} class="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {route === "playground" && (
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
                Context (JSON5):
                <textarea
                  value={context}
                  onInput={(e) =>
                    setContext((e.target as HTMLTextAreaElement).value)
                  }
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
                <span class="collapse-icon">
                  {analysisCollapsed ? "▶" : "▼"}
                </span>
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
                <span class="collapse-icon">
                  {backendCollapsed ? "▶" : "▼"}
                </span>
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
                  {feelinResult.warnings &&
                    feelinResult.warnings.length > 0 && (
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
      )}

      {route === "examples" && <TestCasesView />}
    </div>
  );
}
