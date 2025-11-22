import type { Rule } from '../types.js';
import { moduleResolutionMismatch } from './module-resolution-mismatch.js';
import { strictFlagsShadow } from './strict-flags-shadow.js';

/**
 * Registry of all built-in rules. Order here is the default reporting order.
 */
export const rules: readonly Rule[] = [moduleResolutionMismatch, strictFlagsShadow];

export function findRule(id: string): Rule | undefined {
  return rules.find((r) => r.id === id);
}
