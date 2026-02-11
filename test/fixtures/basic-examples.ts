import type { InputType } from "../../src/types";

export interface TestCases {
  expression: string;
  context?: Record<string, unknown>;
  description?: string;
  expected?: {
    inputs?: Record<string, InputType>;
  };
}

export const testCases: TestCases[] = [
  {
    expression: "firstName + lastName",
    description: "Unknown type without context",
    expected: {
      inputs: {
        firstName: { type: "unknown" },
        lastName: { type: "unknown" },
      },
    },
  },
  {
    expression: 'firstName + " " + lastName',
    description: "String type from literal - Variables inferred as strings",
    expected: {
      inputs: {
        firstName: { type: "string" },
        lastName: { type: "string" },
      },
    },
  },
  {
    expression: "age + 5 + offset",
    description: "Number type from literal - Variables inferred as numbers",
    expected: {
      inputs: {
        age: { type: "number" },
        offset: { type: "number" },
      },
    },
  },
  {
    expression: "user.name + user.email",
    description: "Context type - Detects accessed properties (name, email)",
    expected: {
      inputs: {
        user: { 
          type: "context", 
          properties: {
            email: { type: "unknown" },
            name: { type: "unknown" }
          }
        },
      },
    },
  },
  {
    expression: "products[item.price > 100 and item.inStock]",
    description: "List type - Detects item structure (price, inStock)",
    expected: {
      inputs: {
        products: { type: "list", itemProperties: [] },
      },
    },
  },
  {
    expression: "x > 5",
    description: "Number from comparison - Comparison suggests numeric type",
    expected: {
      inputs: {
        x: { type: "number" },
      },
    },
  },
  {
    expression: "x + y",
    description: "Unknown type - Could be string or number without literals",
    expected: {
      inputs: {
        x: { type: "unknown" },
        y: { type: "unknown" },
      },
    },
  },
  {
    expression: "[ {x: 1}, {x: 2}, {x:3}][item.x>2]",
    description: "Filter on literal - 'item' is implicit, no external inputs",
    expected: {
      inputs: {},
    },
  },
  {
    expression: "[ {x: 1}, {x: 2}, {x:3}][x>y]",
    description:
      "Filter with external variable - Detects 'y' as external input",
    expected: {
      inputs: {
        y: { type: "unknown" },
      },
    },
  },
  {
    expression: "list[x>2]",
    description: "Filter on variable - 'list' required; 'x' is item property",
    expected: {
      inputs: {
        list: { type: "list", itemProperties: ["x"] },
      },
    },
  },

  {
    expression: "a + b.c",
    description: "Mixed paths - Simple variable 'a' and path 'b.c'",
    expected: {
      inputs: {
        a: { type: "unknown" },
        b: { 
          type: "context", 
          properties: {
            c: { type: "unknown" }
          }
        },
      },
    },
  },
  {
    expression: "{a: {b: c}}.a.b",
    description: "Literal context path - Only 'c' is external",
    expected: {
      inputs: {
        c: { type: "unknown" },
      },
    },
  },
  {
    expression: 'fromAi(toolCall.yearlyIncome, "prompt", "number")',
    description: "Function arguments - Detects nested path in arguments",
    expected: {
      inputs: {
        fromAi: { type: "unknown" },
        toolCall: { 
          type: "context", 
          properties: {
            yearlyIncome: { type: "unknown" }
          }
        },
      },
    },
  },

  {
    expression: "{ a: 1, b: a + c }",
    description: "Local scoping - 'a' is local, only 'c' is external",
    expected: {
      inputs: {
        c: { type: "unknown" },
      },
    },
  },
  {
    expression: '{ db: db, user: "postgres" }',
    description: "Context with external variable - Detects 'db' input",
    expected: {
      inputs: {
        db: { type: "unknown" },
      },
    },
  },
  {
    expression: "{ a: 1, b: 2, c: 3 }",
    description: "Context output - Returns context with keys a, b, c",
    expected: {
      inputs: {},
    },
  },
  {
    expression: "[1, 2, 3]",
    description: "List output - Returns a list",
    expected: {
      inputs: {},
    },
  },
  {
    expression: "5 + 10",
    description: "Number output - Returns numeric result",
    expected: {
      inputs: {},
    },
  },
  {
    expression: '"hello" + "world"',
    description: "String output - Returns string result",
    expected: {
      inputs: {},
    },
  },
  {
    expression: '5 + "hello"',
    description: "Mixed literals - Ambiguous type (number + string)",
    expected: {
      inputs: {},
    },
  },
  {
    expression: '"text {{variable}}"',
    description: "String interpolation - Variables in strings ignored",
    expected: {
      inputs: {},
    },
  },
  {
    expression: "x + y",
    context: { x: "hello", y: "world" },
    description: "Context inference - Output type inferred from context values",
    expected: {
      inputs: {
        x: { type: "unknown" },
        y: { type: "unknown" },
      },
    },
  },
  {
    expression: `{
  user: { name: user.name, email: user_email }
}.user`,
    description:
      "Nested context with path access - Detects user.name and user_email",
    expected: {
      inputs: {
        user: { 
          type: "context", 
          properties: {
            name: { type: "unknown" }
          }
        },
        user_email: { type: "unknown" },
      },
    },
  },
  {
    expression: "for i in [1,2,3] return i + x + 9",
    description: "For expression - Local variable 'i' in iteration",
    expected: {
      inputs: {
        x: { type: "number" },
      },
    },
  },
  {
    expression: "some x in [1,2,3] satisfies x > y",
    description:
      "Quantified expression (some) - Local variable 'x' in condition",
    expected: {
      inputs: {
        y: { type: "unknown" },
      },
    },
  },
  {
    expression: "every x in list satisfies x > 0",
    description:
      "Quantified expression (every) - 'x' is local, 'list' is external",
    expected: {
      inputs: {
        list: { type: "unknown" },
      },
    },
  },
  {
    expression: "function(a, b) a + b + c",
    description:
      "Function definition - Parameters 'a' and 'b' are local, 'c' is external",
    expected: {
      inputs: {
        c: { type: "unknown" },
      },
    },
  },
  {
    expression: "for x in list1, y in list2 return x + y + z",
    description:
      "For expression with multiple variables - 'x' and 'y' are local",
    expected: {
      inputs: {
        list1: { type: "unknown" },
        list2: { type: "unknown" },
        z: { type: "unknown" },
      },
    },
  },
  {
    expression: "if condition then x else y",
    description: "If expression - All variables are external",
    expected: {
      inputs: {
        condition: { type: "unknown" },
        x: { type: "unknown" },
        y: { type: "unknown" },
      },
    },
  },
];
