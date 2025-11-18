import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * TypeScript only accepts matched pairs for NodeNext/Node16. Using `module: NodeNext`
 * with any other `moduleResolution` (or vice versa) silently changes resolution
 * semantics and is almost always a bug.
 */
const NODE_MODE_PAIRS: Record<string, string> = {
  NodeNext: 'NodeNext',
  Node16: 'Node16',
};

function norm(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  return v[0]!.toUpperCase() + v.slice(1);
}

export const moduleResolutionMismatch: Rule = {
  id: 'module-resolution-mismatch',
  description: 'module and moduleResolution must be paired for NodeNext/Node16',
  check(ctx: ProjectContext): Issue[] {
    const opts = ctx.compilerOptions;
    const mod = norm(opts.module);
    const res = norm(opts.moduleResolution);
    const issues: Issue[] = [];

    for (const mode of Object.keys(NODE_MODE_PAIRS)) {
      if (mod === mode && res && res !== mode) {
        issues.push({
          rule: this.id,
          severity: 'error',
          message: `module="${mod}" requires moduleResolution="${mod}", got "${res}"`,
          rationale:
            'Node16/NodeNext module emit must be paired with matching moduleResolution; mixing them ' +
            'breaks .mts/.cts extension handling and conditional package exports.',
          option: 'compilerOptions.moduleResolution',
          fix: `set compilerOptions.moduleResolution to "${mode}"`,
          file: ctx.tsconfigPath,
        });
      }
      if (res === mode && mod && mod !== mode) {
        issues.push({
          rule: this.id,
          severity: 'error',
          message: `moduleResolution="${res}" requires module="${res}", got "${mod}"`,
          rationale:
            'When moduleResolution is Node16/NodeNext the emit module must match; otherwise emitted ' +
            'JavaScript will use mismatched extension semantics.',
          option: 'compilerOptions.module',
          fix: `set compilerOptions.module to "${mode}"`,
          file: ctx.tsconfigPath,
        });
      }
    }

    // Classic resolution on anything other than legacy AMD/UMD/System is almost always wrong.
    if (res === 'Classic' && mod && !['None', 'AMD', 'UMD', 'System'].includes(mod)) {
      issues.push({
        rule: this.id,
        severity: 'warning',
        message: `moduleResolution="Classic" with module="${mod}" is almost never what you want`,
        rationale:
          'Classic resolution predates Node.js and cannot see node_modules the way bundlers or Node do.',
        option: 'compilerOptions.moduleResolution',
        fix: 'set compilerOptions.moduleResolution to "Node" or "NodeNext"',
        file: ctx.tsconfigPath,
      });
    }

    return issues;
  },
};
