import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

// For ESM, __dirname isn't available, so we create it
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Get all component entry points
function getComponentEntries() {
  const componentsDir = resolve(__dirname, 'src/components');
  return {
    'index': resolve(componentsDir, 'index.js'),
    'atoms/icon-label/IconLabel': resolve(componentsDir, 'atoms/icon-label/IconLabel.js'),
    'molecules/collapsible-item/CollapsibleItem': resolve(componentsDir, 'molecules/collapsible-item/CollapsibleItem.js'),
    'molecules/collapsible-list/CollapsibleList': resolve(componentsDir, 'molecules/collapsible-list/CollapsibleList.js'),
    'organisms/image-collection/ImageCollection': resolve(componentsDir, 'organisms/image-collection/ImageCollection.js'),
    'organisms/selection-menu/SelectionMenu': resolve(componentsDir, 'organisms/selection-menu/SelectionMenu.js'),
    'templates/product-layout/ProductLayout': resolve(componentsDir, 'templates/product-layout/ProductLayout.js')
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: getComponentEntries(),
      name: 'GenericWebComponents',
      formats: ['es']
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: [],
      output: {
        dir: 'dist',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        exports: 'named',
        sourcemap: true
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: false
  },
  plugins: [
    dts({
      tsConfigFilePath: 'tsconfig.json',
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.js', 'src/**/*.jsx'],
      outDir: 'dist/types',
      compilerOptions: {
        declaration: true,
        emitDeclarationOnly: true,
        outDir: 'dist/types',
        rootDir: 'src',
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        }
      },
      rollupTypes: true,
      copyDtsFiles: true
    })
  ]
});
