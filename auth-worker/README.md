# hsc-podcast-auth

Shared **end-to-end-encrypted, append-only** sync backend for the SE + Physics
podcast PWAs. One account works across both subjects; progress is namespaced by
`subject` (`se` / `phy`). The server only stores: username, public salt,
`SHA-256(authToken)`, and opaque AES-GCM ciphertext — it can't read your progress
or your password. Integrity is the goal: only your password can append to your log.

## Crypto (client-side, see app `auth.js` — to be added)
- `salt` = random per user (public).
- `masterKey = PBKDF2(password, salt, 150k, SHA-256)` — **never leaves the device**.
- `encKey` = derived from masterKey (AES-GCM) — encrypts/decrypts event blobs locally.
- `authToken` = separately derived from masterKey — sent as `Authorization: Bearer`;
  the server stores only its SHA-256.

## API
- `GET  /salt?username=` → `{ salt }` (public; lets a new device derive keys)
- `POST /signup` `{ username, salt, authToken }` → 201 / 409 (taken)
- `GET  /events?subject=&since=` (auth) → `{ events: [{id, iv, blob}] }`
- `POST /events` (auth) `{ subject, events: [{iv, blob}] }` → `{ ok, lastId }`

Auth header on the two `/events` routes: `Authorization: Bearer <authToken>` plus
`X-Username: <username>`.

## Deploy (NOT yet run — needs Fred's go-ahead)
```sh
cd auth-worker
wrangler d1 create hsc-podcast-auth          # paste database_id into wrangler.toml
wrangler d1 execute hsc-podcast-auth --remote --file schema.sql
wrangler deploy                              # prints the Worker URL
```
Then point the apps' `AUTH_API` constant at the Worker URL and redeploy them.

## Not yet implemented / TODO
- Client `auth.js` (key derivation, encrypt/decrypt, sync push/pull + replay).
- Login/signup UI in Settings; auto-generated usernames.
- Wire sync into the three localStorage stores (progress, quiz SR, downloads).
- Rate limiting (Cloudflare WAF rule or per-user counters) for anti-abuse.
