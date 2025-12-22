import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { check } from '../src/check.js';

const FIX = resolve(__dirname, 'fixtures');

describe('rules', () => {
  it('clean project produces no issues', () => {
    const r = check(resolve(FIX, 'clean/tsconfig.json'));
    expect(r.issues).toEqual([]);
    expect(r.counts.error).toBe(0);
  });

  it('flags module/moduleResolution mismatch', () => {
    const r = check(resolve(FIX, 'module-mismatch/tsconfig.json'));
    const ids = r.issues.map((i) => i.rule);
    expect(ids).toContain('module-resolution-mismatch');
    expect(r.counts.error).toBeGreaterThan(0);
  });

  it('flags strict-flags-shadow when strict=false with flags on', () => {
    const r = check(resolve(FIX, 'strict-shadow/tsconfig.json'));
    expect(r.issues.some((i) => i.rule === 'strict-flags-shadow')).toBe(true);
  });

  it('flags paths without baseUrl', () => {
    const r = check(resolve(FIX, 'paths-no-baseurl/tsconfig.json'));
    expect(r.issues.some((i) => i.rule === 'paths-without-baseurl')).toBe(true);
  });

  it('flags target too old for declared node engines', () => {
    const r = check(resolve(FIX, 'target-old/tsconfig.json'));
    expect(r.issues.some((i) => i.rule === 'target-old-for-engines')).toBe(true);
  });

  it('--only filters rules', () => {
    const r = check(resolve(FIX, 'module-mismatch/tsconfig.json'), {
      only: ['strict-flags-shadow'],
    });
    expect(r.issues.every((i) => i.rule === 'strict-flags-shadow')).toBe(true);
  });
});
