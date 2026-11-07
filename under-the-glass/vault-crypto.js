// Shared by the unlock page and the service worker. The matching encryption
// lives in scripts/lock-library.mjs, so a change to one must go in the other.
const Vault = (() => {
  const DB = 'under-the-glass';
  const STORE = 'keys';
  const ENTRY = 'library';
  const encoder = new TextEncoder();

  const fromBase64 = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
  const toHex = buffer => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');

  // The keys are made non-extractable: the browser can use them but no script
  // can read them back out.
  async function deriveKeys(passphrase, meta) {
    const base = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(meta.salt), iterations: meta.iterations }, base, 512,
    ));
    const enc = await crypto.subtle.importKey('raw', bits.slice(0, 32), 'AES-GCM', false, ['decrypt']);
    const name = await crypto.subtle.importKey('raw', bits.slice(32), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return { enc, name };
  }

  function decrypt(keys, blob, path) {
    const bytes = new Uint8Array(blob);
    return crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytes.slice(0, 12), additionalData: encoder.encode(path) },
      keys.enc,
      bytes.slice(12),
    );
  }

  async function fileId(keys, path) {
    const mac = await crypto.subtle.sign('HMAC', keys.name, encoder.encode(`path:${path}`));
    return toHex(mac).slice(0, 32);
  }

  async function fits(keys, meta) {
    try {
      await decrypt(keys, fromBase64(meta.check), 'check');
      return true;
    } catch {
      return false;
    }
  }

  function withStore(mode, use) {
    return new Promise((resolve, reject) => {
      const open = indexedDB.open(DB, 1);
      open.onupgradeneeded = () => open.result.createObjectStore(STORE);
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const db = open.result;
        const request = use(db.transaction(STORE, mode).objectStore(STORE));
        request.onerror = () => { db.close(); reject(request.error); };
        request.onsuccess = () => { db.close(); resolve(request.result); };
      };
    });
  }

  const saveKeys = keys => withStore('readwrite', store => store.put(keys, ENTRY));
  const loadKeys = () => withStore('readonly', store => store.get(ENTRY));
  const clearKeys = () => withStore('readwrite', store => store.delete(ENTRY));

  return { deriveKeys, decrypt, fileId, fits, saveKeys, loadKeys, clearKeys };
})();
