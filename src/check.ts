import { buildContext } from './loader.js';
import { rules } from './rules/index.js';
import type { CheckResult, Issue } from './types.js';

export interface CheckOptions {
  /** Subset of rule ids to run; defaults to all. */
  only?: readonly string[];
  /** Rule ids to skip. */
  skip?: readonly string[];
}

export function check(tsconfigPath: string, options: CheckOptions = {}): CheckResult {
  const ctx = buildContext(tsconfigPath);
  const selected = rules.filter((r) => {
    if (options.only && !options.only.includes(r.id)) return false;
    if (options.skip && options.skip.includes(r.id)) return false;
    return true;
  });
  const issues: Issue[] = [];
  for (const rule of selected) {
    issues.push(...rule.check(ctx));
  }

  const counts = { error: 0, warning: 0, info: 0 };
  for (const i of issues) counts[i.severity] += 1;

  return { tsconfigPath: ctx.tsconfigPath, issues, counts };
}
