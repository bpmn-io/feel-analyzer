import { useState, useEffect } from "preact/hooks";
import { Playground } from "./Playground";
import { Examples } from "./Examples.tsx";

export function App() {
  const [showConfig, setShowConfig] = useState(false);
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem("feel-analyzer-backend-url") || "";
  });
  const [tempBackendUrl, setTempBackendUrl] = useState(backendUrl);

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
      setRoute(getRoute());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Load URL params on mount or route change
  const urlParams = getUrlParams();

  const handleSaveConfig = () => {
    setBackendUrl(tempBackendUrl);
    localStorage.setItem("feel-analyzer-backend-url", tempBackendUrl);
    setShowConfig(false);
  };

  const handleCancelConfig = () => {
    setTempBackendUrl(backendUrl);
    setShowConfig(false);
  };

  return (
    <div class="container">
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

      <header>
        <h1>FEEL Analyzer Playground</h1>
        <div style="display: flex; align-items: center; gap: 16px; justify-content: space-between;">
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

      {route === "playground" && (
        <Playground
          backendUrl={backendUrl}
          initialExpression={
            urlParams?.expression
              ? decodeURIComponent(urlParams.expression)
              : undefined
          }
          initialContext={
            urlParams?.context
              ? decodeURIComponent(urlParams.context)
              : undefined
          }
          initialExpressionType={
            urlParams?.expressionType as "expression" | "unaryTest" | undefined
          }
          initialUnaryTestValue={
            urlParams?.unaryTestValue
              ? decodeURIComponent(urlParams.unaryTestValue)
              : undefined
          }
        />
      )}

      {route === "examples" && <Examples />}
    </div>
  );
}
