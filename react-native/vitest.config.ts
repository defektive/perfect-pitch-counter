import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, '.') },
      // Stub `react-native` so vitest doesn't try to parse RN's Flow-typed
      // source. The exact-match regex avoids capturing react-native-* siblings.
      {
        find: /^react-native$/,
        replacement: path.resolve(__dirname, 'test-utils/react-native-mock.ts'),
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['./test-utils/setup.ts'],
    server: {
      deps: {
        inline: [/@testing-library\/react-native/, /react-native/],
      },
    },
    coverage: {
      provider: 'istanbul',
      include: [
        'hooks/**/*.ts',
        'hooks/**/*.tsx',
        'components/**/*.ts',
        'components/**/*.tsx',
        'constants/**/*.ts',
      ],
      exclude: [
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        'dist/**',
        'dist-check/**',
        'android/**',
        'scripts/**',
        'node_modules/**',
        'test-utils/**',
      ],
    },
  },
});
