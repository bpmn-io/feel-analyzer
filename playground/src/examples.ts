import type { InputType, OutputType } from "../../src/types.js";

export interface Example {
  expression: string;
  context?: Record<string, unknown>;
  description?: string;
  expected?: {
    neededInputs?: string[];
    inputTypes?: Record<string, InputType>;
    outputType?: OutputType;
  };
}

export const examples: Example[] = [
  {
    expression: "firstName + lastName",
    description: "Unknown type without context",
    expected: {
      neededInputs: ["firstName", "lastName"],
      inputTypes: {
        firstName: { type: "unknown" },
        lastName: { type: "unknown" },
      },
      outputType: { type: "unknown" },
    },
  },
  {
    expression: 'firstName + " " + lastName',
    description: "String type from literal - Variables inferred as strings",
    expected: {
      neededInputs: ["firstName", "lastName"],
      inputTypes: {
        firstName: { type: "string" },
        lastName: { type: "string" },
      },
      outputType: { type: "string" },
    },
  },
  {
    expression: "age + 5 + offset",
    description: "Number type from literal - Variables inferred as numbers",
    expected: {
      neededInputs: ["age", "offset"],
      inputTypes: {
        age: { type: "number" },
        offset: { type: "number" },
      },
      outputType: { type: "number" },
    },
  },
  {
    expression: "user.name + user.email",
    description: "Context type - Detects accessed properties (name, email)",
    expected: {
      neededInputs: ["user.email", "user.name"],
      inputTypes: {
        user: { type: "context", properties: ["email", "name"] },
      },
      outputType: { type: "unknown" },
    },
  },
  {
    expression: "products[item.price > 100 and item.inStock]",
    description: "List type - Detects item structure (price, inStock)",
    expected: {
      neededInputs: ["products"],
      inputTypes: {
        products: { type: "list", itemProperties: [] },
      },
      outputType: { type: "list" },
    },
  },
  {
    expression: "x > 5",
    description: "Number from comparison - Comparison suggests numeric type",
    expected: {
      neededInputs: ["x"],
      inputTypes: {
        x: { type: "number" },
      },
      outputType: { type: "boolean" },
    },
  },
  {
    expression: "x + y",
    description: "Unknown type - Could be string or number without literals",
    expected: {
      neededInputs: ["x", "y"],
      inputTypes: {
        x: { type: "unknown" },
        y: { type: "unknown" },
      },
      outputType: { type: "unknown" },
    },
  },
  {
    expression: "[ {x: 1}, {x: 2}, {x:3}][item.x>2]",
    description: "Filter on literal - 'item' is implicit, no external inputs",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "list" },
    },
  },
  {
    expression: "[ {x: 1}, {x: 2}, {x:3}][x>y]",
    description:
      "Filter with external variable - Detects 'y' as external input",
    expected: {
      neededInputs: ["y"],
      inputTypes: {
        y: { type: "unknown" },
      },
      outputType: { type: "list" },
    },
  },
  {
    expression: "list[x>2]",
    description: "Filter on variable - 'list' required; 'x' is item property",
    expected: {
      neededInputs: ["list"],
      inputTypes: {
        list: { type: "list", itemProperties: ["x"] },
      },
      outputType: { type: "list" },
    },
  },

  {
    expression: "a + b.c",
    description: "Mixed paths - Simple variable 'a' and path 'b.c'",
    expected: {
      neededInputs: ["a", "b.c"],
      inputTypes: {
        a: { type: "unknown" },
        b: { type: "context", properties: ["c"] },
      },
      outputType: { type: "unknown" },
    },
  },
  {
    expression: "{a: {b: c}}.a.b",
    description: "Literal context path - Only 'c' is external",
    expected: {
      neededInputs: ["c"],
      inputTypes: {
        c: { type: "unknown" },
      },
      outputType: { type: "value" },
    },
  },
  {
    expression: 'fromAi(toolCall.yearlyIncome, "prompt", "number")',
    description: "Function arguments - Detects nested path in arguments",
    expected: {
      neededInputs: ["fromAi", "toolCall.yearlyIncome"],
      inputTypes: {
        fromAi: { type: "unknown" },
        toolCall: { type: "context", properties: ["yearlyIncome"] },
      },
      outputType: { type: "value" },
    },
  },

  {
    expression: "{ a: 1, b: a + c }",
    description: "Local scoping - 'a' is local, only 'c' is external",
    expected: {
      neededInputs: ["c"],
      inputTypes: {
        c: { type: "unknown" },
      },
      outputType: { type: "context", keys: ["a", "b"] },
    },
  },
  {
    expression: '{ db: db, user: "postgres" }',
    description: "Context with external variable - Detects 'db' input",
    expected: {
      neededInputs: ["db"],
      inputTypes: {
        db: { type: "unknown" },
      },
      outputType: { type: "context", keys: ["db", "user"] },
    },
  },
  {
    expression: "{ a: 1, b: 2, c: 3 }",
    description: "Context output - Returns context with keys a, b, c",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "context", keys: ["a", "b", "c"] },
    },
  },
  {
    expression: "[1, 2, 3]",
    description: "List output - Returns a list",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "list" },
    },
  },
  {
    expression: "5 + 10",
    description: "Number output - Returns numeric result",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "number" },
    },
  },
  {
    expression: '"hello" + "world"',
    description: "String output - Returns string result",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "string" },
    },
  },
  {
    expression: '5 + "hello"',
    description: "Mixed literals - Ambiguous type (number + string)",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "unknown" },
    },
  },
  {
    expression: '"text {{variable}}"',
    description: "String interpolation - Variables in strings ignored",
    expected: {
      neededInputs: [],
      inputTypes: {},
      outputType: { type: "string" },
    },
  },
  {
    expression: "x + y",
    context: { x: "hello", y: "world" },
    description: "Context inference - Output type inferred from context values",
    expected: {
      neededInputs: ["x", "y"],
      inputTypes: {
        x: { type: "unknown" },
        y: { type: "unknown" },
      },
      outputType: { type: "string" },
    },
  },
  {
    expression: `{
  user: { name: user.name, email: user_email }
}.user`,
    description:
      "Nested context with path access - Detects user.name and user_email",
    expected: {
      neededInputs: ["user.name", "user_email"],
      inputTypes: {
        user: { type: "context", properties: ["name"] },
        user_email: { type: "unknown" },
      },
      outputType: { type: "value" },
    },
  },
  {
    expression: "for i in [1,2,3] return i + x + 9",
    description: "For expression - Local variable 'i' in iteration",
    expected: {
      neededInputs: ["x"],
      inputTypes: {
        x: { type: "number" },
      },
      outputType: { type: "value" },
    },
  },
  {
    expression: "some x in [1,2,3] satisfies x > y",
    description:
      "Quantified expression (some) - Local variable 'x' in condition",
    expected: {
      neededInputs: ["y"],
      inputTypes: {
        y: { type: "unknown" },
      },
      outputType: { type: "boolean" },
    },
  },
  {
    expression: "every x in list satisfies x > 0",
    description:
      "Quantified expression (every) - 'x' is local, 'list' is external",
    expected: {
      neededInputs: ["list"],
      inputTypes: {
        list: { type: "unknown" },
      },
      outputType: { type: "boolean" },
    },
  },
  {
    expression: "function(a, b) a + b + c",
    description:
      "Function definition - Parameters 'a' and 'b' are local, 'c' is external",
    expected: {
      neededInputs: ["c"],
      inputTypes: {
        c: { type: "unknown" },
      },
      outputType: { type: "value" },
    },
  },
  {
    expression: "for x in list1, y in list2 return x + y + z",
    description:
      "For expression with multiple variables - 'x' and 'y' are local",
    expected: {
      neededInputs: ["list1", "list2", "z"],
      inputTypes: {
        list1: { type: "unknown" },
        list2: { type: "unknown" },
        z: { type: "unknown" },
      },
      outputType: { type: "value" },
    },
  },
  {
    expression: "if condition then x else y",
    description: "If expression - All variables are external",
    expected: {
      neededInputs: ["condition", "x", "y"],
      inputTypes: {
        condition: { type: "unknown" },
        x: { type: "unknown" },
        y: { type: "unknown" },
      },
      outputType: { type: "value" },
    },
  },
];
