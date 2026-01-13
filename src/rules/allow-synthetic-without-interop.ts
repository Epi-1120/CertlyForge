import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * esModuleInterop implies allowSyntheticDefaultImports. Enabling the latter without
 * the former only silences type errors — runtime imports will still fail when
 * consuming CommonJS modules with default-import syntax.
 */
export const allowSyntheticWithoutInterop: Rule = {
  id: 'allow-synthetic-without-interop',
  description:
    'allowSyntheticDefaultImports=true without esModuleInterop=true only silences type errors.',
  check(ctx: ProjectContext): Issue[] {
    const o = ctx.compilerOptions;
    if (o.allowSyntheticDefaultImports === true && o.esModuleInterop !== true) {
      return [
        {
          rule: this.id,
          severity: 'warning',
          message:
            'allowSyntheticDefaultImports is on but esModuleInterop is not — runtime CJS interop will still fail',
          rationale:
            'allowSyntheticDefaultImports only affects type-checking of default imports. Without ' +
            'esModuleInterop the emitted JS will still crash at runtime when importing a CJS module ' +
            '`import x from \'cjs-pkg\'` (x will be undefined).',
          option: 'compilerOptions.esModuleInterop',
          fix: 'set compilerOptions.esModuleInterop to true',
          file: ctx.tsconfigPath,
        },
      ];
    }
    return [];
  },
};
