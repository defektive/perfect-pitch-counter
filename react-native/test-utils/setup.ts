import { vi } from 'vitest';
import Module from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// `react-native` ships Flow-typed source that esbuild can't parse. Two layers
// of redirection cover both code paths:
//   1. vi.mock — for ESM imports inside test files (transformed by vitest).
//   2. Module._resolveFilename hook — for native CommonJS `require('react-native')`
//      calls inside @testing-library/react-native, which bypass vitest's loader.
const here = path.dirname(fileURLToPath(import.meta.url));
const cjsStub = path.resolve(here, 'react-native-mock.cjs');

const originalResolve = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (request: string, ...rest: unknown[]) {
  if (request === 'react-native') return cjsStub;
  return originalResolve.call(this, request, ...rest);
};

vi.mock('react-native', async () => {
  return await import('./react-native-mock');
});

// React 19 prints a deprecation banner the first time react-test-renderer is
// used. The library is still our only path for RN component testing under
// vitest, so suppress that one specific message.
for (const channel of ['warn', 'error'] as const) {
  const original = console[channel];
  console[channel] = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === 'string' && first.includes('react-test-renderer is deprecated')) return;
    original(...args);
  };
}
