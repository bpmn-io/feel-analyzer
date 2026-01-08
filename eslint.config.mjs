import bpmnIoPlugin from 'eslint-plugin-bpmn-io';
import tseslint from 'typescript-eslint';

const files = {
  ignored: [
    'dist',
    '**/dist',
    'tmp'
  ],
  build: [
    '*.mjs',
    'vite.config.ts'
  ],
  typescript: [
    'src/**/*.ts',
    'test/**/*.ts'
  ],
  test: [
    'test/**/*.ts',
    'test/**/*.js'
  ]
};

export default [
  {
    ignores: files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {
    return {
      ...config,
      files: files.build
    };
  }),

  // TypeScript files
  ...tseslint.configs.recommended.map(config => {
    return {
      ...config,
      files: files.typescript,
      rules: {
        ...config.rules,
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
          }
        ]
      }
    };
  }),

  // lib + test
  ...bpmnIoPlugin.configs.browser.map(config => {
    return {
      ...config,
      ignores: files.build
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: files.test,
      rules: {
        ...config.rules,
        '@typescript-eslint/no-unused-expressions': 'off'
      }
    };
  })
];
