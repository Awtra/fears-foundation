/**
 * Copy guard for The Fears Foundation.
 *
 * House rule: NO em dashes ( - , U+2014) anywhere in the project.
 *
 * node scripts/check-copy.mjs report only, exits 1 if any em dash found
 * node scripts/check-copy.mjs --fix rewrite em dashes as spaced hyphens
 *
 * En dashes (–, U+2013) are NOT auto-changed: they are legitimate in numeric
 * ranges such as "K–12". They are reported so the choice stays visible.
 *
 * Node modules, build output, and the generated preview are skipped by design.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fix = process.argv.includes('--fix');

/* Only files that carry hand-authored copy, markup, styles, or docs. */
const TEXT_EXTENSIONS = new Set([
  '.jsx',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.css',
  '.html',
  '.json',
  '.md',
  '.txt',
  '.yml',
  '.yaml',
]);

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'shots', '.hermes', 'coverage']);
const SKIP_FILES = new Set(['preview.html', 'package-lock.json']);

const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(join(dir, entry.name), out);
    } else if (
      entry.isFile() &&
      TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase()) &&
      !SKIP_FILES.has(entry.name)
    ) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

const files = await walk(root);
const emHits = [];
const enHits = [];
let fixedFiles = 0;

for (const file of files) {
  const original = await readFile(file, 'utf8');
  const rel = relative(root, file).split('\\').join('/');

  const count = (text, ch) => text.split(ch).length - 1;

  const emBefore = count(original, EM_DASH);
  const enBefore = count(original, EN_DASH);

  if (enBefore > 0) enHits.push({ rel, count: enBefore });

  if (emBefore === 0) continue;

  /* Report each occurrence with its line and a trimmed context. */
  original.split(/\r?\n/).forEach((line, i) => {
    if (line.includes(EM_DASH)) {
      emHits.push({ rel, line: i + 1, text: line.trim().slice(0, 96) });
    }
  });

  if (fix) {
    /* Normalize ONLY the whitespace hugging the dash. A global `[ \t]{2,}`
      collapse would also flatten every line's leading indentation, which
      silently reformats the whole file - keep this scoped to the match. */
    const cleaned = original.replace(/[ \t]*\u2014[ \t]*/g, ' - ');
    await writeFile(file, cleaned, 'utf8');
    fixedFiles += 1;
  }
}

const label = fix ? 'rewritten' : 'found';
console.log(`em dashes ${label}: ${fix ? fixedFiles + ' file(s)' : emHits.length}`);
if (!fix) {
  for (const hit of emHits) console.log(` ${hit.rel}:${hit.line} ${hit.text}`);
}

if (enHits.length > 0) {
  console.log('\nen dashes present (legit in ranges such as K-12, left untouched):');
  for (const hit of enHits) console.log(` ${hit.rel} x${hit.count}`);
}

if (!fix && emHits.length > 0) process.exitCode = 1;
