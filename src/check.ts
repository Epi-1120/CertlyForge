import { buildContext } from './loader.js';
import { rules } from './rules/index.js';
import type { CheckResult, Issue, Severity } from './types.js';

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

const SEV_RANK: Record<Severity, number> = { info: 0, warning: 1, error: 2 };

/**
 * Decide whether a CheckResult should fail CI given a maximum allowed severity.
 * Returns true when the result contains any issue whose severity is >= threshold.
 */
export function exceedsThreshold(result: CheckResult, threshold: Severity): boolean {
  const min = SEV_RANK[threshold];
  return result.issues.some((i) => SEV_RANK[i.severity] >= min);
}
