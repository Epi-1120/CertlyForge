import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * Options deprecated across TS 5.x. When still present they either have no effect,
 * or produce warnings from tsc itself at build time. Cleaning them up is free.
 */
const DEPRECATED: ReadonlyArray<{
  option: string;
  replacement?: string;
  sinceMajor: number;
  note: string;
}> = [
  {
    option: 'importsNotUsedAsValues',
    replacement: 'verbatimModuleSyntax',
    sinceMajor: 5,
    note: 'superseded in TS 5.0 by the combined verbatimModuleSyntax flag',
  },
  {
    option: 'preserveValueImports',
    replacement: 'verbatimModuleSyntax',
    sinceMajor: 5,
    note: 'superseded in TS 5.0 by the combined verbatimModuleSyntax flag',
  },
  {
    option: 'suppressExcessPropertyErrors',
    sinceMajor: 5,
    note: 'historically a migration aid; removed in TS 5.5',
  },
  {
    option: 'suppressImplicitAnyIndexErrors',
    sinceMajor: 5,
    note: 'historically a migration aid; removed in TS 5.5',
  },
  {
    option: 'noStrictGenericChecks',
    sinceMajor: 5,
    note: 'flag was a compatibility escape hatch; type-check failures should be fixed instead',
  },
  {
    option: 'charset',
    sinceMajor: 5,
    note: 'TS always emits UTF-8 now',
  },
];

export const deprecatedOptions: Rule = {
  id: 'deprecated-options',
  description: 'Flag deprecated compilerOptions that have no effect (or are removed) in modern TS.',
  check(ctx: ProjectContext): Issue[] {
    const opts = ctx.compilerOptions;
    const issues: Issue[] = [];
    for (const entry of DEPRECATED) {
      if (opts[entry.option] !== undefined) {
        issues.push({
          rule: this.id,
          severity: 'warning',
          message: `compilerOptions.${entry.option} is deprecated (${entry.note})`,
          rationale:
            'Deprecated options either have no effect in recent TypeScript versions or will start ' +
            'emitting warnings. Removing them makes the tsconfig future-proof.',
          option: `compilerOptions.${entry.option}`,
          fix: entry.replacement
            ? `remove and configure compilerOptions.${entry.replacement} instead`
            : `remove compilerOptions.${entry.option}`,
          file: ctx.tsconfigPath,
        });
      }
    }
    return issues;
  },
};
