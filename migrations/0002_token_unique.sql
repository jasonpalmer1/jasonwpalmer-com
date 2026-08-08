-- Harden subscriber tokens: unique + status check.
-- Safe on empty/UUID data; run after 0001_subscribers.sql.
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_token_unique
  ON subscribers (token);
