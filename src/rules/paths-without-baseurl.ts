import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * Before TypeScript 4.1 `compilerOptions.paths` required `baseUrl`. From 4.1+
 * `paths` is interpreted relative to the tsconfig directory when baseUrl is
 * absent, but many build tools (older ts-node, webpack resolve, rollup plugins)
 * still expect baseUrl to be present. We flag this as a warning.
 */
export const pathsWithoutBaseurl: Rule = {
  id: 'paths-without-baseurl',
  description: 'paths is used without baseUrl — fine for modern tsc but many tools require baseUrl.',
  check(ctx: ProjectContext): Issue[] {
    const opts = ctx.compilerOptions;
    const paths = opts.paths;
    const baseUrl = opts.baseUrl;
    if (
      paths &&
      typeof paths === 'object' &&
      !Array.isArray(paths) &&
      Object.keys(paths).length > 0 &&
      baseUrl === undefined
    ) {
      return [
        {
          rule: this.id,
          severity: 'warning',
          message: 'compilerOptions.paths is set without compilerOptions.baseUrl',
          rationale:
            'While TypeScript 4.1+ allows paths without baseUrl (resolving relative to the tsconfig ' +
            'directory), many bundler/build-tool integrations still require baseUrl to be set. Omitting ' +
            'it is a common source of "module not found" errors outside of tsc itself.',
          option: 'compilerOptions.baseUrl',
          fix: 'set compilerOptions.baseUrl to "." (or the directory your paths are relative to).',
          file: ctx.tsconfigPath,
        },
      ];
    }
    return [];
  },
};
