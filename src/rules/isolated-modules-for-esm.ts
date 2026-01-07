import type { Issue, ProjectContext, Rule } from '../types.js';

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function isEsmModule(mod: string | undefined): boolean {
  if (!mod) return false;
  const m = mod.toLowerCase();
  return m.startsWith('esnext') || m.startsWith('es20') || m === 'es6' || m === 'es2015';
}

function isNodeNextLike(mod: string | undefined): boolean {
  if (!mod) return false;
  const m = mod.toLowerCase();
  return m === 'nodenext' || m === 'node16' || m === 'node18';
}

/**
 * Projects emitting ESM-style output (native ESM or NodeNext) and consumed by
 * single-file transpilers (esbuild, swc, Vite, bundlers) should set
 * isolatedModules=true so tsc catches constructs that cannot be transpiled in
 * isolation (e.g. const-only enums).
 */
export const isolatedModulesForEsm: Rule = {
  id: 'isolated-modules-for-esm',
  description:
    'When emitting ESM / using single-file transpilers, isolatedModules should be true.',
  check(ctx: ProjectContext): Issue[] {
    const opts = ctx.compilerOptions;
    const module = str(opts.module);
    const isolated = opts.isolatedModules === true;
    if (isolated) return [];

    const pkgType = str(ctx.packageJson?.type);
    const isEsm = isEsmModule(module) || isNodeNextLike(module) || pkgType === 'module';
    if (!isEsm) return [];

    return [
      {
        rule: this.id,
        severity: 'warning',
        message: 'compilerOptions.isolatedModules should be true for ESM / single-file-transpiler setups',
        rationale:
          'Without isolatedModules, tsc may allow constructs (const enums, namespace re-exports, ' +
          'implicit type-only exports) that esbuild / swc / Vite cannot transpile file-by-file, ' +
          'producing runtime errors not caught at build time.',
        option: 'compilerOptions.isolatedModules',
        fix: 'set compilerOptions.isolatedModules to true',
        file: ctx.tsconfigPath,
      },
    ];
  },
};
