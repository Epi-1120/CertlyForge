#!/usr/bin/env node
import { cac } from 'cac';
import { resolve } from 'node:path';
import { check } from './check.js';

const cli = cac('tsconfig-doctor');

cli
  .command('check [path]', 'Check a tsconfig.json for common problems')
  .option('--only <rules>', 'Comma-separated rule ids to run')
  .option('--skip <rules>', 'Comma-separated rule ids to skip')
  .action((path: string | undefined, flags: { only?: string; skip?: string }) => {
    const target = resolve(path ?? 'tsconfig.json');
    const result = check(target, {
      only: flags.only?.split(',').map((s) => s.trim()).filter(Boolean),
      skip: flags.skip?.split(',').map((s) => s.trim()).filter(Boolean),
    });

    if (result.issues.length === 0) {
      process.stdout.write(`tsconfig-doctor: no issues found in ${result.tsconfigPath}\n`);
      return;
    }
    for (const i of result.issues) {
      process.stdout.write(`[${i.severity}] ${i.rule}: ${i.message}\n`);
      if (i.fix) process.stdout.write(`  fix: ${i.fix}\n`);
    }
    process.stdout.write(`\nErrors: ${result.counts.error}, Warnings: ${result.counts.warning}, Info: ${result.counts.info}\n`);
    if (result.counts.error > 0) process.exit(1);
  });

cli.help();
cli.version('0.0.1');
cli.parse();
