# tsconfig-doctor

> Diagnose common `tsconfig.json` configuration problems — module / moduleResolution
> mismatches, deprecated options, missing fields, incompatible strict settings, and more.

`tsconfig-doctor` is a zero-config linter for your TypeScript configuration. It reads
`tsconfig.json` (resolving the full `extends` chain) plus the nearest `package.json`,
runs a set of focused rules, and tells you what is subtly wrong before it wastes a
debugging afternoon.

## Features

- Pure JSON inspection; no TypeScript compiler launched.
- Follows `extends` chains (relative paths, bare specifiers, and TS 5.0+ arrays).
- Plain-text console output, Markdown (for PRs), or JSON (for CI).
- Categorises issues as `error`, `warning`, or `info`.
- Rules include:
  - `module-resolution-mismatch`
  - `strict-flags-shadow`
  - `paths-without-baseurl`
  - `target-old-for-engines`
  - `deprecated-options`
  - `isolated-modules-for-esm`
  - `allow-synthetic-without-interop`
  - `declaration-without-outdir`

## Install

```bash
npm install --save-dev tsconfig-doctor
```

## Usage

```bash
npx tsconfig-doctor check ./tsconfig.json
npx tsconfig-doctor check --format markdown > report.md
npx tsconfig-doctor check --format json | jq '.counts'
```

Filter rules:

```bash
npx tsconfig-doctor check --only module-resolution-mismatch,strict-flags-shadow
npx tsconfig-doctor check --skip paths-without-baseurl
```

Programmatic use:

```ts
import { check } from 'tsconfig-doctor';

const result = check('./tsconfig.json');
for (const issue of result.issues) {
  console.log(issue.rule, issue.severity, issue.message);
}
```

## Exit codes

- `0` — no errors (warnings and info do not fail).
- `1` — one or more errors detected.

## License

MIT
