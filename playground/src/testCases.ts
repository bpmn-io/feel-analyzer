export interface TestCase {
  expression: string;
  context?: Record<string, unknown>;
  description?: string;
}

export const testCases: TestCase[] = [
  {
    expression: "firstName + lastName",
    description: "Unknown type without context",
  },
  {
    expression: 'firstName + " " + lastName',
    description: "String type from literal - Variables inferred as strings",
  },
  {
    expression: "age + 5 + offset",
    description: "Number type from literal - Variables inferred as numbers",
  },
  {
    expression: "user.name + user.email",
    description: "Context type - Detects accessed properties (name, email)",
  },
  {
    expression: "products[item.price > 100 and item.inStock]",
    description: "List type - Detects item structure (price, inStock)",
  },
  {
    expression: "x > 5",
    description: "Number from comparison - Comparison suggests numeric type",
  },
  {
    expression: "x + y",
    description: "Unknown type - Could be string or number without literals",
  },
  {
    expression: "[ {x: 1}, {x: 2}, {x:3}][item.x>2]",
    description: "Filter on literal - 'item' is implicit, no external inputs",
  },
  {
    expression: "[ {x: 1}, {x: 2}, {x:3}][x>y]",
    description:
      "Filter with external variable - Detects 'y' as external input",
  },
  {
    expression: "list[x>2]",
    description: "Filter on variable - 'list' required; 'x' is item property",
  },

  {
    expression: "a + b.c",
    description: "Mixed paths - Simple variable 'a' and path 'b.c'",
  },
  {
    expression: "{a: {b: c}}.a.b",
    description: "Literal context path - Only 'c' is external",
  },
  {
    expression: 'fromAi(toolCall.yearlyIncome, "prompt", "number")',
    description: "Function arguments - Detects nested path in arguments",
  },

  {
    expression: "{ a: 1, b: a + c }",
    description: "Local scoping - 'a' is local, only 'c' is external",
  },
  {
    expression: '{ db: db, user: "postgres" }',
    description: "Context with external variable - Detects 'db' input",
  },
  {
    expression: "{ a: 1, b: 2, c: 3 }",
    description: "Context output - Returns context with keys a, b, c",
  },
  {
    expression: "[1, 2, 3]",
    description: "List output - Returns a list",
  },
  {
    expression: "5 + 10",
    description: "Number output - Returns numeric result",
  },
  {
    expression: '"hello" + "world"',
    description: "String output - Returns string result",
  },
  {
    expression: '5 + "hello"',
    description: "Mixed literals - Ambiguous type (number + string)",
  },
  {
    expression: '"text {{variable}}"',
    description: "String interpolation - Variables in strings ignored",
  },
  {
    expression: "x + y",
    context: { x: "hello", y: "world" },
    description: "Context inference - Output type inferred from context values",
  },
];
