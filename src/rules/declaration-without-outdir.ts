import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * declaration=true without outDir puts .d.ts next to sources. For published packages
 * this means consumers see your entire source tree, and `npm publish` hits the
 * .d.ts files in src/ which is rarely what anyone wants.
 */
export const declarationWithoutOutdir: Rule = {
  id: 'declaration-without-outdir',
  description:
    'declaration=true without outDir emits .d.ts next to sources — almost never right for published packages.',
  check(ctx: ProjectContext): Issue[] {
    const o = ctx.compilerOptions;
    const pkg = ctx.packageJson ?? {};
    const isPublishable = pkg.private !== true && typeof pkg.name === 'string';
    if (o.declaration !== true) return [];
    if (o.outDir) return [];
    if (!isPublishable) return [];

    return [
      {
        rule: this.id,
        severity: 'warning',
        message: 'declaration=true is set without outDir — type definitions will land next to source files',
        rationale:
          'Published packages almost always want build output in a separate folder (dist/). Emitting ' +
          '.d.ts next to sources pollutes the source tree and often ends up shipping source files by ' +
          'accident through npm.',
        option: 'compilerOptions.outDir',
        fix: 'set compilerOptions.outDir to "dist" (or another build directory)',
        file: ctx.tsconfigPath,
      },
    ];
  },
};
