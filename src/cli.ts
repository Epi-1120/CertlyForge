#!/usr/bin/env node
import { cac } from 'cac';
import { resolve } from 'node:path';
import { check, exceedsThreshold } from './check.js';
import { renderConsole, renderJson, renderMarkdown } from './report.js';
import type { Severity } from './types.js';

type Format = 'console' | 'markdown' | 'json';

const cli = cac('tsconfig-doctor');

cli
  .command('check [path]', 'Check a tsconfig.json for common problems')
  .option('--only <rules>', 'Comma-separated rule ids to run')
  .option('--skip <rules>', 'Comma-separated rule ids to skip')
  .option('--format <format>', 'Output format: console | markdown | json', {
    default: 'console',
  })
  .option('--max-severity <severity>', 'Fail when any issue reaches this severity (info | warning | error)', {
    default: 'error',
  })
  .action((
    path: string | undefined,
    flags: {
      only?: string;
      skip?: string;
      format?: Format;
      'max-severity'?: Severity;
      maxSeverity?: Severity;
    }
  ) => {
    const target = resolve(path ?? 'tsconfig.json');
    const result = check(target, {
      only: flags.only?.split(',').map((s) => s.trim()).filter(Boolean),
      skip: flags.skip?.split(',').map((s) => s.trim()).filter(Boolean),
    });

    const format = (flags.format ?? 'console') as Format;
    const body =
      format === 'json'
        ? renderJson(result)
        : format === 'markdown'
          ? renderMarkdown(result)
          : renderConsole(result);
    process.stdout.write(body + '\n');

    const threshold = (flags.maxSeverity ?? flags['max-severity'] ?? 'error') as Severity;
    if (exceedsThreshold(result, threshold)) process.exit(1);
  });

cli.help();
cli.version('0.1.0');
cli.parse();
