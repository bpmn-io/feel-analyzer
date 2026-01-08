import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FeelAnalyzer',
      fileName: 'index',
      formats: [ 'es' ],
    },
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [
    dts({
      include: [ 'src/**/*' ],
      exclude: [ 'src/**/*.spec.ts', 'test/**/*' ],
    }),
  ],
});
