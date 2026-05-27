import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    build: true,
  },
  clean: true,
  minify: true,
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
});


