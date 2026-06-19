-- ============================================================================
-- CodeBase AI Assistant — Supabase Database Schema
-- Normalized to 3NF with RLS, indexes, and constraints.
-- Run this in Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS — synced from Supabase Auth on first sign-in
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY,
    email       TEXT NOT NULL,
    name        TEXT NOT NULL DEFAULT '',
    avatar_url  TEXT DEFAULT '',
    bio         TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile; service_role can manage all (via backend)
CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. USER PREFERENCES — 1:1 with users, stores UI/UX settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme           TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
    voice_enabled   BOOLEAN DEFAULT false,
    auto_speak      BOOLEAN DEFAULT false,
    max_tokens      INTEGER DEFAULT 2000
                                  CHECK (max_tokens >= 256 AND max_tokens <= 8192),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. QUERY HISTORY — every question a user asks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS query_history (
    id                BIGSERIAL PRIMARY KEY,
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query             TEXT NOT NULL,
    rewritten_query   TEXT,
    corrected_query   TEXT,
    answer            TEXT NOT NULL,
    sources           JSONB DEFAULT '[]'::jsonb,
    latency_ms        FLOAT DEFAULT 0,
    intent            TEXT,
    confidence_level  TEXT CHECK (confidence_level IN ('high', 'medium', 'low', 'none')),
    confidence_score  FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    is_grounded       BOOLEAN,
    token_count       INTEGER,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_query_history_user_created
    ON query_history(user_id, created_at DESC);

CREATE INDEX idx_query_history_intent
    ON query_history(user_id, intent);

ALTER TABLE query_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own history"
    ON query_history FOR SELECT
    USING (auth.uid() = user_id);

-- Backend inserts via service_role key
CREATE POLICY "Service role can insert history"
    ON query_history FOR INSERT
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. QUERY FEEDBACK — user ratings on answers (1:1 with query_history)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS query_feedback (
    id              BIGSERIAL PRIMARY KEY,
    query_id        BIGINT NOT NULL UNIQUE REFERENCES query_history(id) ON DELETE CASCADE,
    rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_query_feedback_query
    ON query_feedback(query_id);

ALTER TABLE query_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feedback"
    ON query_feedback FOR SELECT
    USING (
        auth.uid() = (SELECT user_id FROM query_history WHERE id = query_id)
    );

CREATE POLICY "Users can insert own feedback"
    ON query_feedback FOR INSERT
    WITH CHECK (
        auth.uid() = (SELECT user_id FROM query_history WHERE id = query_id)
    );

CREATE POLICY "Users can update own feedback"
    ON query_feedback FOR UPDATE
    USING (
        auth.uid() = (SELECT user_id FROM query_history WHERE id = query_id)
    )
    WITH CHECK (
        auth.uid() = (SELECT user_id FROM query_history WHERE id = query_id)
    );

-- ----------------------------------------------------------------------------
-- 5. USER REPOS — repositories ingested by each user
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_repos (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    repo_url        TEXT NOT NULL,
    repo_name       TEXT,
    branch          TEXT DEFAULT 'main',
    status          TEXT DEFAULT 'completed'
                        CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    chunks_count    INTEGER DEFAULT 0,
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, repo_url)
);

CREATE TRIGGER set_user_repos_updated_at
    BEFORE UPDATE ON user_repos
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_user_repos_user_created
    ON user_repos(user_id, created_at DESC);

ALTER TABLE user_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own repos"
    ON user_repos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repos"
    ON user_repos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 6. USER ACTIVITY LOG — audit trail for significant events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_activity_log (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action      TEXT NOT NULL,
    details     JSONB,
    ip_address  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user_created
    ON user_activity_log(user_id, created_at DESC);

CREATE INDEX idx_activity_action
    ON user_activity_log(action);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own activity; insert allowed for service_role
CREATE POLICY "Users can read own activity"
    ON user_activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert activity"
    ON user_activity_log FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- Helper functions
-- ============================================================================

-- Create user profile + preferences on first sign-in
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email, ''),
        NEW.raw_user_meta_data ->> 'avatar_url'
    );

    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create profile when a user signs up via Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- Notes:
--   1. The `handle_new_user` trigger runs on every sign-up via Supabase Auth,
--      creating the user profile and default preferences automatically.
--   2. RLS uses `auth.uid()` — the user's Supabase Auth UID.
--   3. Backend uses the service_role key to bypass RLS for inserts into
--      query_history and user_activity_log.
--   4. All timestamps use TIMESTAMPTZ (stored as UTC).
-- ============================================================================
