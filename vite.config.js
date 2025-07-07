import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';
import baseUrlPlugin from './vite.baseurl.js';

// For ESM, __dirname isn't available, so we create it
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  const isDocs = mode === 'docs';

  // Base config for library
  const baseConfig = {
    root: './',
    base: isDocs ? '/generic-webcomponents/' : '/',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };

  // Docs build configuration
  if (isDocs) {
    return {
      ...baseConfig,
      base: './',  // Use relative paths for GitHub Pages
      plugins: [
        {
          name: 'rewrite-asset-paths',
          transformIndexHtml(html) {
            // Convert absolute paths to relative paths
            return html
              .replace(/\/generic-webcomponents\//g, '')
              .replace(/<base href=".*?">/, '');
          }
        }
      ],
      build: {
        outDir: 'docs',
        emptyOutDir: true,
        assetsDir: 'assets',
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            IconLabelPage: resolve(__dirname, 'src/docs/pages/IconLabelPage.js'),
            ProductLayoutPage: resolve(__dirname, 'src/docs/pages/ProductLayoutPage.js'),
            ImageCollectionPage: resolve(__dirname, 'src/docs/pages/ImageCollectionPage.js'),
            CollapsibleItemPage: resolve(__dirname, 'src/docs/pages/CollapsibleItemPage.js'),
            SelectionMenuPage: resolve(__dirname, 'src/docs/pages/SelectionMenuPage.js')
          },
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
        // Ensure assets are copied to the correct directory
        assetsInlineLimit: 0,
      },
      server: {
        port: 3000,
        strictPort: true
      },
    };
  }

  // Library build config
  if (isBuild && !isDocs) {
    return {
      ...baseConfig,
      plugins: [
        dts({
          insertTypesEntry: true,
          include: ['src/**/*'],
          exclude: ['**/__tests__/**', '**/*.test.js'],
        }),
      ],
      build: {
        outDir: 'dist',
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
          name: 'GenericWebComponents',
          fileName: (format) => `index.${format}.js`,
          formats: ['es', 'umd'],
        },
        rollupOptions: {
          // Make sure to externalize deps that shouldn't be bundled
          external: ['react', 'react-dom', 'vue'],
          output: {
            // Provide global variables to use in the UMD build
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              vue: 'Vue',
            },
          },
        },
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      },
    };
  }

  // Docs/dev server config
  return {
    ...baseConfig,
    base: process.env.NODE_ENV === 'production' ? '/mad-js-dev-generic-webcomponents/' : '/',
    server: {
      port: 3001,
      open: '/docs.html',
      host: true,
      hmr: {
        overlay: false,
        reload: true,
      },
    },
    css: {
      devSourcemap: false,
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'docs.html'),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    preview: {
      port: 3001,
    },
  };
});
