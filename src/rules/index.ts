import type { Rule } from '../types.js';
import { moduleResolutionMismatch } from './module-resolution-mismatch.js';
import { strictFlagsShadow } from './strict-flags-shadow.js';
import { pathsWithoutBaseurl } from './paths-without-baseurl.js';
import { targetOldForEngines } from './target-old-for-engines.js';
import { deprecatedOptions } from './deprecated-options.js';

export const rules: readonly Rule[] = [
  moduleResolutionMismatch,
  strictFlagsShadow,
  pathsWithoutBaseurl,
  targetOldForEngines,
  deprecatedOptions,
];

export function findRule(id: string): Rule | undefined {
  return rules.find((r) => r.id === id);
}
