# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-04-19

### Added
- Initial public release.
- `check()` API and `tsconfig-doctor check` CLI.
- Loader resolving the full `extends` chain (strings, arrays, bare specifiers).
- JSONC tolerant parser (comments and trailing commas).
- Nearest `package.json` discovery with type / engines awareness.
- 10 built-in rules:
  - `module-resolution-mismatch`
  - `strict-flags-shadow`
  - `paths-without-baseurl`
  - `target-old-for-engines`
  - `deprecated-options`
  - `isolated-modules-for-esm`
  - `allow-synthetic-without-interop`
  - `declaration-without-outdir`
  - `decorator-metadata-pair`
  - `types-field-missing`
- Console, Markdown, and JSON renderers.
- `--only` / `--skip` filters and `--max-severity` threshold for CI gating.
- GitHub Actions workflow running lint + typecheck + vitest across Node 18/20/22
  on Ubuntu, Windows, and macOS.
