-- PaperSimple Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Cached paper explanations
CREATE TABLE IF NOT EXISTS paper_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  text_hash text NOT NULL,
  depth text NOT NULL CHECK (depth IN ('high-school', 'undergrad', 'graduate', 'expert')),
  explanation jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  access_count int DEFAULT 1,
  UNIQUE(text_hash, depth)
);

CREATE INDEX idx_paper_cache_hash ON paper_cache(text_hash);

-- 2. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL CHECK (char_length(comment) >= 1 AND char_length(comment) <= 1000),
  helpful int DEFAULT 0,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- 3. Visitor tracking (anonymized — no PII stored)
CREATE TABLE IF NOT EXISTS visitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at timestamptz DEFAULT now(),
  page text DEFAULT '/'
);

CREATE INDEX idx_visitors_date ON visitors(visited_at);

-- 4. Rate limit tracking
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_hash, action, created_at);

-- Auto-cleanup: delete rate limit entries older than 1 hour
-- (run via Supabase cron or pg_cron extension)
-- SELECT cron.schedule('cleanup-rate-limits', '*/30 * * * *',
--   $$DELETE FROM rate_limits WHERE created_at < now() - interval '1 hour'$$
-- );

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE paper_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Paper cache: anyone can read and insert
CREATE POLICY "paper_cache_select" ON paper_cache FOR SELECT USING (true);
CREATE POLICY "paper_cache_insert" ON paper_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "paper_cache_update" ON paper_cache FOR UPDATE USING (true);

-- Reviews: anyone can read, insert (with constraints), and update helpful count
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "reviews_update_helpful" ON reviews FOR UPDATE USING (true);

-- Visitors: anyone can insert and read count
CREATE POLICY "visitors_insert" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "visitors_select" ON visitors FOR SELECT USING (true);

-- Rate limits: anyone can insert and read (for checking)
CREATE POLICY "rate_limits_insert" ON rate_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "rate_limits_select" ON rate_limits FOR SELECT USING (true);
CREATE POLICY "rate_limits_delete" ON rate_limits FOR DELETE USING (true);
