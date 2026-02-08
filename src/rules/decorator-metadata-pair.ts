import type { Issue, ProjectContext, Rule } from '../types.js';

/**
 * `experimentalDecorators` and `emitDecoratorMetadata` are traditionally used together.
 * Enabling emitDecoratorMetadata without experimentalDecorators has no effect, and
 * enabling experimentalDecorators without emitDecoratorMetadata silently drops runtime
 * type metadata relied on by DI frameworks (NestJS, InversifyJS, TypeORM).
 */
export const decoratorMetadataPair: Rule = {
  id: 'decorator-metadata-pair',
  description:
    'experimentalDecorators and emitDecoratorMetadata usually need to be set together.',
  check(ctx: ProjectContext): Issue[] {
    const o = ctx.compilerOptions;
    const exp = o.experimentalDecorators === true;
    const meta = o.emitDecoratorMetadata === true;
    const issues: Issue[] = [];

    if (meta && !exp) {
      issues.push({
        rule: this.id,
        severity: 'warning',
        message: 'emitDecoratorMetadata is on but experimentalDecorators is off — the metadata flag has no effect',
        rationale:
          'emitDecoratorMetadata only emits metadata when decorators are actually allowed. Without ' +
          'experimentalDecorators TypeScript will not process decorator syntax and the metadata ' +
          'option is silently ignored.',
        option: 'compilerOptions.experimentalDecorators',
        fix: 'set compilerOptions.experimentalDecorators to true, or remove emitDecoratorMetadata',
        file: ctx.tsconfigPath,
      });
    }
    if (exp && !meta) {
      issues.push({
        rule: this.id,
        severity: 'info',
        message:
          'experimentalDecorators is on but emitDecoratorMetadata is off — DI frameworks that rely on runtime type metadata will break',
        rationale:
          'NestJS, TypeORM, InversifyJS and similar DI frameworks use reflect-metadata at runtime to ' +
          'discover constructor parameter types. Without emitDecoratorMetadata that info is not ' +
          'emitted and runtime injection fails silently or with cryptic errors.',
        option: 'compilerOptions.emitDecoratorMetadata',
        fix: 'set compilerOptions.emitDecoratorMetadata to true if you use a DI framework',
        file: ctx.tsconfigPath,
      });
    }
    return issues;
  },
};
