import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { buildContext, loadTsconfig } from '../src/loader.js';

const FIX = resolve(__dirname, 'fixtures');

describe('loader', () => {
  it('loads a plain tsconfig', () => {
    const { compilerOptions } = loadTsconfig(resolve(FIX, 'clean/tsconfig.json'));
    expect(compilerOptions.target).toBe('ES2022');
    expect(compilerOptions.module).toBe('NodeNext');
  });

  it('merges an extends chain', () => {
    const { compilerOptions } = loadTsconfig(resolve(FIX, 'extends/child.json'));
    expect(compilerOptions.target).toBe('ES2020');
    expect(compilerOptions.strict).toBe(true);
    expect(compilerOptions.module).toBe('NodeNext');
  });

  it('buildContext finds the nearest package.json', () => {
    const ctx = buildContext(resolve(FIX, 'clean/tsconfig.json'));
    expect(ctx.packageJson?.name).toBe('clean-fixture');
  });

  it('throws on missing tsconfig', () => {
    expect(() => loadTsconfig(resolve(FIX, 'does-not-exist/tsconfig.json'))).toThrow();
  });
});
