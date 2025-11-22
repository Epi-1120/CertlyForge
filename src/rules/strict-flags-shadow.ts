import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * Individual compilerOptions whose value is ignored when `strict` is true
 * but which take effect when `strict` is false.
 */
const STRICT_FLAGS = [
  'noImplicitAny',
  'strictNullChecks',
  'strictFunctionTypes',
  'strictBindCallApply',
  'strictPropertyInitialization',
  'noImplicitThis',
  'useUnknownInCatchVariables',
  'alwaysStrict',
] as const;

export const strictFlagsShadow: Rule = {
  id: 'strict-flags-shadow',
  description:
    'Warn when strict is disabled but individual strict flags are left on (or vice versa).',
  check(ctx: ProjectContext): Issue[] {
    const opts = ctx.compilerOptions;
    const strict = opts.strict;
    const issues: Issue[] = [];

    if (strict === false || strict === undefined) {
      const enabled = STRICT_FLAGS.filter((k) => opts[k] === true);
      if (enabled.length > 0) {
        issues.push({
          rule: this.id,
          severity: 'warning',
          message: `"strict" is off but individual strict flag(s) enabled: ${enabled.join(', ')}`,
          rationale:
            'Having strict=false with selective flags on is confusing and brittle; later TypeScript ' +
            'versions may add flags to the "strict" bundle that you silently miss out on.',
          option: 'compilerOptions.strict',
          fix: 'set compilerOptions.strict to true and remove the individual flags, or turn off all of them.',
          file: ctx.tsconfigPath,
        });
      }
    } else if (strict === true) {
      const disabled = STRICT_FLAGS.filter((k) => opts[k] === false);
      if (disabled.length > 0) {
        issues.push({
          rule: this.id,
          severity: 'info',
          message: `"strict" is on but some flag(s) are explicitly disabled: ${disabled.join(', ')}`,
          rationale:
            'Opting out of individual strict flags defeats the purpose of "strict". Prefer fixing the ' +
            'underlying code, or narrow the opt-out to the smallest scope (per-file pragma / sub-project).',
          option: 'compilerOptions',
          file: ctx.tsconfigPath,
        });
      }
    }

    return issues;
  },
};
