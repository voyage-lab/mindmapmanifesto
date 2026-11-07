// Encrypts the private library so it can sit on the public site unreadable.
//
//   npm run lock            encrypt private/ into under-the-glass/vault/
//   npm run lock -- --show  also print the key and the one-tap bookmark link
//
//   npm run lock -- --new-key  replace the key: every saved bookmark stops working
//
// The key lives in .library-key, which git ignores. A strong key is made on the
// first run. Keep a copy somewhere safe: without it the published vault can't be
// opened, though private/ can always be locked again with --new-key.
//
// Run it after changing anything in private/, then commit under-the-glass/vault/.
// Unchanged files encrypt to identical bytes, so git only sees what really changed.
import { createCipheriv, createHash, createHmac, pbkdf2Sync, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const SRC = process.env.LIBRARY_SRC || 'private';
const OUT = process.env.LIBRARY_OUT || 'under-the-glass/vault';
const KEY_FILE = process.env.LIBRARY_KEY_FILE || '.library-key';
const SITE = 'https://mindmapmanifesto.com/under-the-glass/';
const ITERATIONS = 600000;
const MIN_KEY_LENGTH = 20;

// Sources and clutter that a browser never asks for.
const SKIP_NAMES = new Set(['.DS_Store', '.git', 'notes']);
const SKIP_EXTS = new Set(['.jsx', '.md']);

function* files(dir, prefix = '') {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_NAMES.has(e.name)) continue;
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) yield* files(join(dir, e.name), rel);
    else if (!SKIP_EXTS.has(extname(e.name))) yield rel;
  }
}

// 32 letters and digits, with the look-alikes (l, o, 0, 1) left out. 150 bits.
function generateKey() {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const chars = [...randomBytes(30)].map(b => alphabet[b % 32]).join('');
  return chars.match(/.{5}/g).join('-');
}

function loadKey() {
  if (process.argv.includes('--new-key')) rmSync(KEY_FILE, { force: true });
  else if (!existsSync(KEY_FILE) && existsSync(join(OUT, 'meta.json'))) {
    console.error(`${KEY_FILE} is missing, but the vault was locked with a key. Restore it, or run with --new-key to replace it.`);
    process.exit(1);
  }
  if (!existsSync(KEY_FILE)) {
    writeFileSync(KEY_FILE, generateKey() + '\n', { mode: 0o600 });
    console.log(`made a new key in ${KEY_FILE}`);
  }
  const key = readFileSync(KEY_FILE, 'utf8').trim();
  if (key.length < MIN_KEY_LENGTH) {
    console.error(`The key in ${KEY_FILE} is too short: the vault is public, so a weak key can be guessed offline. Use at least ${MIN_KEY_LENGTH} characters.`);
    process.exit(1);
  }
  return key;
}

function loadSalt() {
  const meta = join(OUT, 'meta.json');
  if (existsSync(meta)) return Buffer.from(JSON.parse(readFileSync(meta, 'utf8')).salt, 'base64');
  return randomBytes(16);
}

const hmac = (key, text) => createHmac('sha256', key).update(text).digest();

// Must match Vault.fileId in under-the-glass/vault-crypto.js.
const fileId = (nameKey, path) => hmac(nameKey, `path:${path}`).toString('hex').slice(0, 32);

// Must match Vault.decrypt. The IV comes from the path and contents, which is
// what keeps unchanged files byte-identical between runs. The path is
// authenticated too, so one vault file can't be swapped in for another.
function encrypt(encKey, nameKey, path, plain) {
  const digest = createHash('sha256').update(plain).digest('hex');
  const iv = hmac(nameKey, `iv:${path}:${digest}`).subarray(0, 12);
  const cipher = createCipheriv('aes-256-gcm', encKey, iv);
  cipher.setAAD(Buffer.from(path, 'utf8'));
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([iv, body, cipher.getAuthTag()]);
}

// Locking removes whatever isn't in private/, so a missing folder must not empty the vault.
if (!existsSync(join(SRC, 'index.html'))) {
  console.error(`Nothing to lock: ${SRC}/index.html doesn't exist.`);
  process.exit(1);
}

const passphrase = loadKey();
const salt = loadSalt();
const bits = pbkdf2Sync(Buffer.from(passphrase, 'utf8'), salt, ITERATIONS, 64, 'sha256');
const encKey = bits.subarray(0, 32);
const nameKey = bits.subarray(32);

mkdirSync(OUT, { recursive: true });
const wanted = new Set(['meta.json']);
let locked = 0;
let changed = 0;

for (const path of files(SRC)) {
  const name = `${fileId(nameKey, path)}.bin`;
  const blob = encrypt(encKey, nameKey, path, readFileSync(join(SRC, path)));
  const out = join(OUT, name);
  wanted.add(name);
  locked++;
  if (existsSync(out) && readFileSync(out).equals(blob)) continue;
  writeFileSync(out, blob);
  changed++;
}

let removed = 0;
for (const name of readdirSync(OUT)) {
  if (wanted.has(name)) continue;
  rmSync(join(OUT, name));
  removed++;
}

const check = encrypt(encKey, nameKey, 'check', Buffer.from('under the glass', 'utf8'));
writeFileSync(join(OUT, 'meta.json'), JSON.stringify({
  version: 1, iterations: ITERATIONS, salt: salt.toString('base64'), check: check.toString('base64'),
}, null, 2) + '\n');

console.log(`locked ${locked} files (${changed} changed, ${removed} removed) into ${OUT}/`);
if (process.argv.includes('--show')) {
  console.log(`\nkey:      ${passphrase}\nbookmark: ${SITE}#key=${encodeURIComponent(passphrase)}\n`);
  console.log('Treat that bookmark like a password: anyone who has it can open the library.');
}
