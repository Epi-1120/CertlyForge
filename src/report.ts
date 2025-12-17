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

function escapeMd(text: string): string {
  return text.replace(/([|\\])/g, '\\$1');
}

export function renderMarkdown(result: CheckResult): string {
  const lines: string[] = [];
  lines.push(`# tsconfig-doctor report`);
  lines.push('');
  lines.push(`- **Project:** \`${result.tsconfigPath}\``);
  lines.push(`- **Errors:** ${result.counts.error}`);
  lines.push(`- **Warnings:** ${result.counts.warning}`);
  lines.push(`- **Info:** ${result.counts.info}`);
  lines.push('');

  if (result.issues.length === 0) {
    lines.push('No issues found.');
    return lines.join('\n');
  }

  lines.push('| Severity | Rule | Option | Message |');
  lines.push('| --- | --- | --- | --- |');
  for (const i of result.issues) {
    lines.push(
      `| ${i.severity} | \`${i.rule}\` | ${i.option ? '`' + i.option + '`' : ''} | ${escapeMd(i.message)} |`
    );
  }
  lines.push('');
  for (const i of result.issues) {
    lines.push(`### \`${i.rule}\` - ${i.severity}`);
    lines.push('');
    lines.push(i.message);
    if (i.rationale) {
      lines.push('');
      lines.push(`> ${i.rationale}`);
    }
    if (i.fix) {
      lines.push('');
      lines.push(`**Fix:** ${i.fix}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function renderJson(result: CheckResult): string {
  return JSON.stringify(result, null, 2);
}

function _unused(_: Issue): void {
  // reserved
}
