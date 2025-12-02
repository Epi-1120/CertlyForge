import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * Minimum ECMAScript target reasonable for each Node major. Pinning target lower than
 * the runtime supports means tsc down-levels code the runtime already understands,
 * producing unnecessary helpers and larger output.
 */
const NODE_MIN_TARGET: ReadonlyArray<{ node: number; target: string }> = [
  { node: 20, target: 'ES2022' },
  { node: 18, target: 'ES2022' },
  { node: 16, target: 'ES2021' },
  { node: 14, target: 'ES2020' },
  { node: 12, target: 'ES2019' },
];

const TARGET_ORDER: ReadonlyArray<string> = [
  'ES3',
  'ES5',
  'ES6',
  'ES2015',
  'ES2016',
  'ES2017',
  'ES2018',
  'ES2019',
  'ES2020',
  'ES2021',
  'ES2022',
  'ES2023',
  'ESNext',
];

function rank(t: string | undefined): number {
  if (!t) return -1;
  const key = t.toUpperCase();
  // Treat ES6 and ES2015 as equivalent.
  const normalized = key === 'ES6' ? 'ES2015' : key;
  return TARGET_ORDER.indexOf(normalized);
}

function parseNodeMajor(engine: string | undefined): number | undefined {
  if (!engine) return undefined;
  const m = /(\d+)/.exec(engine);
  return m ? Number(m[1]) : undefined;
}

export const targetOldForEngines: Rule = {
  id: 'target-old-for-engines',
  description:
    'Warn when compilerOptions.target is older than the Node major declared in package.json engines.',
  check(ctx: ProjectContext): Issue[] {
    const target = ctx.compilerOptions.target as string | undefined;
    const engines = (ctx.packageJson?.engines ?? {}) as Record<string, unknown>;
    const node = parseNodeMajor(engines.node as string | undefined);
    if (!node || !target) return [];

    const expected = NODE_MIN_TARGET.find((e) => node >= e.node)?.target;
    if (!expected) return [];

    if (rank(target) < rank(expected)) {
      return [
        {
          rule: this.id,
          severity: 'warning',
          message: `compilerOptions.target="${target}" is lower than recommended "${expected}" for Node >= ${node}`,
          rationale:
            'Emitting older JavaScript than your runtime supports produces larger output and forces ' +
            'tsc to polyfill features the runtime already has natively.',
          option: 'compilerOptions.target',
          fix: `set compilerOptions.target to "${expected}" or newer`,
          file: ctx.tsconfigPath,
        },
      ];
    }
    return [];
  },
};
