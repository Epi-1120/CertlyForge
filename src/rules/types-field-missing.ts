import { existsSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * package.json's "types" / "typings" field should point to a file that exists. For
 * published packages, a dangling types field means consumers import with no types
 * at all — a silent regression that usually slips past tests.
 */
export const typesFieldMissing: Rule = {
  id: 'types-field-missing',
  description:
    'package.json "types"/"typings" field points to a file that does not exist at build time.',
  check(ctx: ProjectContext): Issue[] {
    const pkg = ctx.packageJson;
    const dir = ctx.packageJsonDir;
    if (!pkg || !dir) return [];
    if (pkg.private === true) return [];

    const field =
      typeof pkg.types === 'string'
        ? 'types'
        : typeof pkg.typings === 'string'
          ? 'typings'
          : undefined;
    if (!field) return [];

    const rel = pkg[field] as string;
    const abs = isAbsolute(rel) ? rel : resolve(dir, rel);
    if (existsSync(abs)) return [];

    return [
      {
        rule: this.id,
        severity: 'error',
        message: `package.json "${field}" points to "${rel}" which does not exist`,
        rationale:
          'A missing types entry means consumers installing this package import it without any type ' +
          'information. This is almost always caused by a forgotten build step or an outdated ' +
          'hand-maintained path, and is a common cause of regressions for library consumers.',
        option: `package.json.${field}`,
        fix: 'run the build, or update the path to point at the correct emitted .d.ts file',
        file: ctx.tsconfigPath,
      },
    ];
  },
};
