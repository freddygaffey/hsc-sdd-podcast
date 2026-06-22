-- hsc-podcast-auth — shared sync DB for the SE + Physics PWAs.
-- One account works across both subjects; progress is namespaced by `subject`.

CREATE TABLE IF NOT EXISTS users (
  username   TEXT PRIMARY KEY,        -- lowercase [a-z0-9_-], 3-40 chars
  salt       TEXT NOT NULL,           -- random, public; lets a new device derive keys
  auth_hash  TEXT NOT NULL,           -- SHA-256(authToken); server never sees the password or enc key
  created_at INTEGER NOT NULL
);

-- Append-only encrypted event log. The server stores opaque ciphertext only.
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT NOT NULL,
  subject    TEXT NOT NULL,           -- 'se' | 'phy'
  iv         TEXT NOT NULL,           -- base64 AES-GCM IV
  blob       TEXT NOT NULL,           -- base64 AES-GCM ciphertext (a progress delta)
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_user ON events (username, subject, id);
