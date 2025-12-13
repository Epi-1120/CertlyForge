import kleur from 'kleur';
import type { CheckResult, Issue, Severity } from './types.js';

const sevColor: Record<Severity, (s: string) => string> = {
  error: kleur.red,
  warning: kleur.yellow,
  info: kleur.cyan,
};

const sevIcon: Record<Severity, string> = {
  error: 'x',
  warning: '!',
  info: 'i',
};

export function renderConsole(result: CheckResult): string {
  if (result.issues.length === 0) {
    return kleur.green(`tsconfig-doctor: no issues found in ${result.tsconfigPath}`);
  }

  const lines: string[] = [];
  lines.push(kleur.bold(`tsconfig-doctor: ${result.tsconfigPath}`));
  lines.push('');

  for (const issue of result.issues) {
    const color = sevColor[issue.severity];
    const icon = sevIcon[issue.severity];
    lines.push(`  ${color(icon)} ${color(issue.severity.toUpperCase())} ${kleur.bold(issue.rule)}`);
    lines.push(`      ${issue.message}`);
    if (issue.option) lines.push(kleur.gray(`      option: ${issue.option}`));
    if (issue.rationale) lines.push(kleur.gray(`      why:    ${issue.rationale}`));
    if (issue.fix) lines.push(kleur.gray(`      fix:    ${issue.fix}`));
    lines.push('');
  }

  const { error, warning, info } = result.counts;
  lines.push(
    `Summary: ${kleur.red(error + ' error' + (error === 1 ? '' : 's'))}, ` +
      `${kleur.yellow(warning + ' warning' + (warning === 1 ? '' : 's'))}, ` +
      `${kleur.cyan(info + ' info')}`
  );
  return lines.join('\n');
}

function _unused(_: Issue): void {
  // placeholder for future formatters that share helpers
}
