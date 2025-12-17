#!/usr/bin/env node
import { cac } from 'cac';
import { resolve } from 'node:path';
import { check } from './check.js';
import { renderConsole, renderJson, renderMarkdown } from './report.js';

type Format = 'console' | 'markdown' | 'json';

const cli = cac('tsconfig-doctor');

cli
  .command('check [path]', 'Check a tsconfig.json for common problems')
  .option('--only <rules>', 'Comma-separated rule ids to run')
  .option('--skip <rules>', 'Comma-separated rule ids to skip')
  .option('--format <format>', 'Output format: console | markdown | json', {
    default: 'console',
  })
  .action((
    path: string | undefined,
    flags: { only?: string; skip?: string; format?: Format }
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
    if (result.counts.error > 0) process.exit(1);
  });

cli.help();
cli.version('0.0.1');
cli.parse();
