import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import type { ProjectContext } from './types.js';

/**
 * Deep-merge `source` onto `target`. Objects are merged; arrays and scalars are overwritten.
 * Returns a new object; inputs are not mutated.
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const out: Record<string, unknown> = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (
      v &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      typeof out[k] === 'object' &&
      out[k] &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

function parseJson(text: string, file: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse ${file}: ${msg}`);
  }
}

function resolveExtends(spec: string, baseDir: string): string {
  // Relative path — as in the TypeScript docs.
  if (spec.startsWith('./') || spec.startsWith('../') || isAbsolute(spec)) {
    const candidate = isAbsolute(spec) ? spec : resolve(baseDir, spec);
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    // Allow omitted .json extension.
    if (!candidate.endsWith('.json') && existsSync(candidate + '.json')) {
      return candidate + '.json';
    }
    throw new Error(`extends path not found: ${spec} (from ${baseDir})`);
  }
  // Bare specifier — try node_modules/<spec>/tsconfig.json and node_modules/<spec>.
  const candidates = [
    resolve(baseDir, 'node_modules', spec),
    resolve(baseDir, 'node_modules', spec, 'tsconfig.json'),
  ];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  throw new Error(`extends specifier not resolvable: ${spec}`);
}

/**
 * Load tsconfig merging any `extends` chain. Returns the merged tsconfig and the
 * absolute path to the leaf (entry) tsconfig.
 */
export function loadTsconfig(entryPath: string): {
  tsconfig: Record<string, unknown>;
  compilerOptions: Record<string, unknown>;
  tsconfigPath: string;
} {
  const abs = isAbsolute(entryPath) ? entryPath : resolve(process.cwd(), entryPath);
  if (!existsSync(abs)) {
    throw new Error(`tsconfig not found: ${abs}`);
  }

  const chain: string[] = [];
  function loadRec(file: string): Record<string, unknown> {
    if (chain.includes(file)) {
      throw new Error(`circular extends: ${[...chain, file].join(' -> ')}`);
    }
    chain.push(file);
    const text = readFileSync(file, 'utf8');
    const cfg = parseJson(text, file);
    const ext = cfg['extends'];
    chain.pop();
    if (typeof ext === 'string') {
      const parent = resolveExtends(ext, dirname(file));
      const parentCfg = loadRec(parent);
      return deepMerge(parentCfg, cfg);
    }
    if (Array.isArray(ext)) {
      // TS 5.0+: extends can be an array, processed left-to-right.
      let merged: Record<string, unknown> = {};
      for (const one of ext) {
        if (typeof one !== 'string') continue;
        const parent = resolveExtends(one, dirname(file));
        merged = deepMerge(merged, loadRec(parent));
      }
      return deepMerge(merged, cfg);
    }
    return cfg;
  }

  const tsconfig = loadRec(abs);
  const compilerOptions =
    (tsconfig['compilerOptions'] as Record<string, unknown> | undefined) ?? {};
  return { tsconfig, compilerOptions, tsconfigPath: abs };
}

/**
 * Locate the nearest package.json relative to a tsconfig path by walking upwards.
 * Returns undefined if none is found below the filesystem root.
 */
export function findNearestPackageJson(
  from: string
): { packageJson: Record<string, unknown>; packageJsonDir: string } | undefined {
  let dir = dirname(from);
  for (;;) {
    const candidate = join(dir, 'package.json');
    if (existsSync(candidate)) {
      try {
        const json = JSON.parse(readFileSync(candidate, 'utf8')) as Record<string, unknown>;
        return { packageJson: json, packageJsonDir: dir };
      } catch {
        return undefined;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

export function buildContext(tsconfigPath: string): ProjectContext {
  const { tsconfig, compilerOptions, tsconfigPath: abs } = loadTsconfig(tsconfigPath);
  const pkg = findNearestPackageJson(abs);
  return {
    tsconfigPath: abs,
    tsconfig,
    compilerOptions,
    packageJson: pkg?.packageJson,
    packageJsonDir: pkg?.packageJsonDir,
  };
}
