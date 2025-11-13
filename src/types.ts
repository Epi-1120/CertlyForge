/**
 * Severity of a diagnostic issue.
 *
 * - "error"   — configuration is broken or unsafe; will cause build/runtime failure.
 * - "warning" — configuration is suspicious; likely a mistake.
 * - "info"    — stylistic / non-fatal suggestion.
 */
export type Severity = 'error' | 'warning' | 'info';

/**
 * A single diagnostic produced by a rule.
 */
export interface Issue {
  /** Stable rule identifier, kebab-case. */
  rule: string;
  severity: Severity;
  message: string;
  /** Short rationale explaining why this matters. */
  rationale?: string;
  /** Dot-separated option path, e.g. "compilerOptions.module". */
  option?: string;
  /** Suggested fix, if any. */
  fix?: string;
  /** Path to the tsconfig file where this was detected (absolute or project-relative). */
  file?: string;
}

/**
 * Resolved context passed to a rule — already merged across any `extends` chain.
 */
export interface ProjectContext {
  /** Absolute path to the effective tsconfig.json. */
  tsconfigPath: string;
  /** Effective compilerOptions after resolving extends. */
  compilerOptions: Record<string, unknown>;
  /** Full raw tsconfig object (merged). */
  tsconfig: Record<string, unknown>;
  /** Parsed package.json nearest to the tsconfig, or undefined. */
  packageJson?: Record<string, unknown>;
  /** Absolute directory containing the package.json. */
  packageJsonDir?: string;
}

/**
 * A rule is a pure function of the project context.
 */
export interface Rule {
  id: string;
  description: string;
  check(ctx: ProjectContext): Issue[];
}

/**
 * Final result of running all rules.
 */
export interface CheckResult {
  tsconfigPath: string;
  issues: Issue[];
  counts: {
    error: number;
    warning: number;
    info: number;
  };
}
