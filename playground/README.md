# FEEL Analyzer Playground

Interactive playground for testing and analyzing FEEL expressions with real-time type inference, evaluation, and comparison between different FEEL engines.

## Setup

Install dependencies:

```bash
npm install
```

## Running

Start the FEEL Scala Playground backend (optional, for backend evaluation):

```bash
docker run -e JAVA_OPTS="-Dplayground.tracking.enabled=false" -e MIXPANEL_PROJECT_TOKEN=false -p 8123:8080 ghcr.io/camunda-community-hub/feel-scala-playground:1.3.9
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

### 🎮 Playground View

- **Expression Input**: Write FEEL expressions or unary tests with support for both modes
- **Context Editor**: Define context variables using JSON5 syntax (supports comments and trailing commas)
- **Smart Context Management**:
  - **Clear Button**: Reset context to empty with one click
  - **Prefill Needed Inputs**: Automatically populate context with missing variables based on analysis
  - Smart deduplication: Only adds variables not already in context
  - Proper nested object structure for property accesses (e.g., `user.name` → `user: { name: "" }`)
  - Type-aware default values based on inference
- **Real-time Analysis**:
  - Type inference for input variables and output
  - Detection of needed inputs
  - Syntax validation
  - Performance metrics
- **Multiple Evaluation Engines**:
  - FEEL Analyzer (local, always available)
  - FEEL Scala Playground (backend, optional)
  - feelin library (local, JavaScript implementation)
- **Collapsible Sections**: All output sections (Analysis, Syntax Tree, Evaluations) can be collapsed
- **URL Sharing**: Share expressions and contexts via URL parameters

### 📚 Examples View

- Browse a curated collection of FEEL expression examples
- Interactive table showing:
  - Expression with descriptions (hover for details)
  - Context used for analysis
  - Needed inputs with inferred types
  - Output type
- Click any example to open it in the playground with pre-filled context
- Context includes both given values and needed inputs with proper structure

### 🎯 Type Inference

The analyzer provides intelligent type inference:
- **Input Types**: Detects required variable types (string, number, boolean, context, list, etc.)
- **Output Types**: Infers the result type of expressions
- **Property Access**: Recognizes nested properties (e.g., `user.name`, `order.items`)
- **Unknown Types**: Clearly marks variables with unknown types

### ⚡ Performance Metrics

Real-time performance tracking for:
- Analysis time (FEEL Analyzer)
- Backend evaluation time (FEEL Scala Playground)
- Frontend evaluation time (feelin)

## Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configuration

The backend URL can be configured via the ⚙️ Configure button in the UI. Settings are persisted in local storage.
