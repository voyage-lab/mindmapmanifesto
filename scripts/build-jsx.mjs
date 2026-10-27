// Compiles every page's .jsx source into the plain .js file the page loads.
// The pages used to ship Babel and translate their JSX in the visitor's
// browser on every load; doing it once here keeps them fast.
//
//   npm run build   rebuild every .js from its .jsx
//   npm run check   fail if any .js is out of date with its .jsx
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { transformSync } from 'esbuild';

const check = process.argv.includes('--check');
const SKIP = new Set(['node_modules', '.git']);

function* jsxFiles(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* jsxFiles(p);
    else if (e.name.endsWith('.jsx')) yield p;
  }
}

let stale = 0;
for (const src of jsxFiles('.')) {
  const out = src.replace(/\.jsx$/, '.js');
  const { code } = transformSync(readFileSync(src, 'utf8'), {
    loader: 'jsx', jsx: 'transform', target: 'es2019', minify: true, sourcefile: src,
  });
  const body = `// Built from ${src.split('/').pop()} by \`npm run build\`. Edit that file, not this one.\n${code}`;
  if (existsSync(out) && readFileSync(out, 'utf8') === body) continue;
  if (check) { console.error(`out of date: ${out}`); stale++; continue; }
  writeFileSync(out, body);
  console.log(`built ${out}`);
}
if (stale) { console.error('Run `npm run build` and commit the result.'); process.exit(1); }
