/*
 Creates the badge analytics table.
 */

-- create
CREATE TABLE IF NOT EXISTS BADGE_ANALYTICS (
  id TEXT PRIMARY KEY,
  stored_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tier TEXT NOT NULL check ( tier in ( 'none', 'basic', 'full' ) ),
  app_version TEXT,
  instance TEXT
);
