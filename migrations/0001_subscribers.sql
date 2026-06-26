-- Dispatch mailing list subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE,
  status      TEXT    NOT NULL DEFAULT 'pending',   -- pending | confirmed | unsubscribed
  token       TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  confirmed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers (token);
