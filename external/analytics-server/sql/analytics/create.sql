/*
 Creates the analytics table.
 */

-- create
CREATE TABLE IF NOT EXISTS ANALYTICS (
  id TEXT PRIMARY KEY,
  stored_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tier TEXT NOT NULL check ( tier in ( 'basic', 'full' ) ),
  model TEXT NOT NULL,
  os TEXT NOT NULL,
  app_version TEXT NOT NULL,
  settings TEXT,
  instance TEXT
);
