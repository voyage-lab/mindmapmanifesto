// Serves the private library. Every request under open/ is turned into a
// lookup in vault/, decrypted with the key saved at unlock, and handed back to
// the browser as an ordinary file, so private pages run without knowing they
// were ever encrypted.
importScripts('vault-crypto.js');

const BASE = new URL('./', self.location).pathname;
const OPEN = `${BASE}open/`;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
};

let keys = null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// The unlock page says so whenever the saved key changes.
self.addEventListener('message', () => { keys = null; });

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith(OPEN)) {
    event.respondWith(serve(url));
  }
});

const toUnlock = () => Response.redirect(BASE, 302);
const unavailable = () => new Response('The library is unavailable right now.', { status: 502 });

function typeOf(path) {
  const dot = path.lastIndexOf('.');
  return TYPES[dot < 0 ? '' : path.slice(dot).toLowerCase()] || 'application/octet-stream';
}

async function serve(url) {
  keys = keys || await Vault.loadKeys();
  if (!keys) return toUnlock();

  let path;
  try {
    path = decodeURIComponent(url.pathname.slice(OPEN.length));
  } catch {
    return new Response('Not found.', { status: 404 });
  }
  if (path === '' || path.endsWith('/')) path += 'index.html';

  const blob = await fetch(`${BASE}vault/${await Vault.fileId(keys, path)}.bin`, { cache: 'no-cache' });
  if (blob.status === 404) {
    // The hub is always in the vault, so missing it means the saved key is out of
    // date. Going through #lock clears it, or the unlock page would send us straight back.
    if (path === 'index.html') return Response.redirect(`${BASE}#lock`, 302);
    // Anything else the vault doesn't hold is a public page, like the two decks.
    return Response.redirect(`${url.origin}/${url.pathname.slice(OPEN.length)}${url.search}`, 302);
  }
  if (!blob.ok) return unavailable();

  // File names come from the key, so a wrong key can't get this far. A failure
  // here is a dropped or damaged download, which is no reason to forget the key.
  try {
    const plain = await Vault.decrypt(keys, await blob.arrayBuffer(), path);
    return new Response(plain, {
      headers: { 'Content-Type': typeOf(path), 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
    });
  } catch {
    return unavailable();
  }
}
