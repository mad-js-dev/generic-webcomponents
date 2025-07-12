import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

// For ESM, __dirname isn't available, so we create it
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.js'),
      name: 'GenericWebComponents',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: [],
      output: {
        // Use a flat output structure
        dir: 'dist',
        format: 'es',
        // Preserve directory structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Output to components directory
        entryFileNames: ({ name }) => {
          // Map entry points to maintain directory structure
          if (name === 'index') return 'index.js';
          return `components/${name}.js`;
        },
        // Keep chunks flat
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Ensure proper module structure
        exports: 'auto'
      }
    },
    // Output to dist
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    dts({
      tsConfigFilePath: 'tsconfig.json',
      insertTypesEntry: true,
      include: ['src/components/**/*'],
      outDir: 'dist/types',
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true
      },
      // Ensure proper module resolution
      rollupTypes: true
    })
  ]
});
