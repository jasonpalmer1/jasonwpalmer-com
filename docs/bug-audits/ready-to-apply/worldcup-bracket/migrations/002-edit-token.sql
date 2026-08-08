-- Per-bracket edit tokens so PUT requires ownership (not just a public id).
ALTER TABLE brackets ADD COLUMN edit_token TEXT;

-- Backfill existing rows so PUT cannot match on NULL tokens.
UPDATE brackets
SET edit_token = lower(hex(randomblob(16)))
WHERE edit_token IS NULL OR edit_token = '';
