import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

// For ESM, __dirname isn't available, so we create it
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';
  const isDocs = mode === 'docs';

  // Base config for both library and docs
  const baseConfig = {
    root: './',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };

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
          entry: resolve(__dirname, 'src/docs/main.js'),
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
