-- ============================================================================
-- CodeBase AI Assistant — Supabase Database Schema
-- Normalized to 3NF with RLS, indexes, and constraints.
-- Run this in Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS — synced from Supabase Auth on first sign-in
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (              -- Core user profile, one row per auth account
    id          UUID PRIMARY KEY,                -- Matches auth.users.id from Supabase Auth
    email       TEXT NOT NULL,                   -- User's email address
    name        TEXT NOT NULL DEFAULT '',         -- Display name, populated from OAuth on sign-up
    avatar_url  TEXT DEFAULT '',                  -- Profile picture URL
    bio         TEXT DEFAULT '',                  -- Optional user-written bio
    created_at  TIMESTAMPTZ DEFAULT NOW(),       -- Account creation timestamp (UTC)
    updated_at  TIMESTAMPTZ DEFAULT NOW()        -- Last update timestamp, auto-maintained
);

-- Auto-update updated_at: generic trigger function reused by every table
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();                      -- Override the updated_at column on every row change
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at               -- Wire the trigger to the users table
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;     -- Enforce per-user row isolation

-- Users can read their own profile; service_role can manage all (via backend)
CREATE POLICY "Users can read own profile"       -- SELECT: only the owning user sees their row
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"     -- UPDATE: only the owning user may edit their row
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. USER PREFERENCES — 1:1 with users, stores UI/UX settings
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_preferences (    -- One row per user, created automatically on sign-up
    id              BIGSERIAL PRIMARY KEY,        -- Internal row identifier
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,  -- FK → users, deleted with user
    theme           TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),  -- UI theme selection
    voice_enabled   BOOLEAN DEFAULT false,        -- Whether voice I/O is enabled
    auto_speak      BOOLEAN DEFAULT false,       -- Whether answers are read aloud automatically
    max_tokens      INTEGER DEFAULT 2000          -- Max tokens for generated responses
                                  CHECK (max_tokens >= 256 AND max_tokens <= 8192),
    created_at      TIMESTAMPTZ DEFAULT NOW(),    -- Row creation timestamp
    updated_at      TIMESTAMPTZ DEFAULT NOW()     -- Last update timestamp (trigger-managed)
);

CREATE TRIGGER set_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"   -- SELECT: only the owning user sees their preferences
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own preferences" -- INSERT: user can create their own preferences row
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" -- UPDATE: user can modify their own preferences
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. QUERY HISTORY — every question a user asks
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS query_history (       -- Log of every query submitted by a user
    id                BIGSERIAL PRIMARY KEY,      -- Unique query ID
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- FK → users
    query             TEXT NOT NULL,               -- Original user question
    rewritten_query   TEXT,                        -- Query after rewriting (e.g. for retrieval)
    corrected_query   TEXT,                        -- Query after spelling/grammar correction
    answer            TEXT NOT NULL,               -- Final answer returned to the user
    sources           JSONB DEFAULT '[]'::jsonb,   -- Array of source file references used in the answer
    latency_ms        FLOAT DEFAULT 0,             -- End-to-end response time in milliseconds
    intent            TEXT,                        -- Classified intent (e.g. "location", "explanation")
    confidence_level  TEXT CHECK (confidence_level IN ('high', 'medium', 'low', 'none')),  -- Overall confidence rating
    confidence_score  FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),  -- Numeric confidence [0,1]
    is_grounded       BOOLEAN,                     -- Whether the answer cites sources
    token_count       INTEGER,                     -- Total tokens in the generated answer
    created_at        TIMESTAMPTZ DEFAULT NOW()    -- When the query was submitted
);

CREATE INDEX idx_query_history_user_created       -- Fast lookup: recent queries per user
    ON query_history(user_id, created_at DESC);

CREATE INDEX idx_query_history_intent             -- Analytics: aggregate queries by intent per user
    ON query_history(user_id, intent);

ALTER TABLE query_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own history"       -- SELECT: users see only their own queries
    ON query_history FOR SELECT
    USING (auth.uid() = user_id);

-- Backend inserts via service_role key (bypasses RLS)
CREATE POLICY "Service role can insert history"  -- INSERT: backend (service_role) writes query logs
    ON query_history FOR INSERT
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. QUERY FEEDBACK — user ratings on answers (1:1 with query_history)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS query_feedback (      -- One rating per query, linked 1:1
    id              BIGSERIAL PRIMARY KEY,        -- Internal feedback ID
    query_id        BIGINT NOT NULL UNIQUE REFERENCES query_history(id) ON DELETE CASCADE,  -- FK → query_history
    rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),  -- Star rating 1-5
    feedback_text   TEXT,                          -- Optional free-text user comment
    created_at      TIMESTAMPTZ DEFAULT NOW()     -- When feedback was submitted
);

CREATE INDEX idx_query_feedback_query             -- Fast lookup of feedback by query
    ON query_feedback(query_id);

ALTER TABLE query_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feedback"      -- SELECT: user reads feedback on their own queries
    ON query_feedback FOR SELECT
    USING (
        auth.uid() = (SELECT user_id FROM query_history WHERE id = query_id)
    );

CREATE POLICY "Users can insert own feedback"    -- INSERT: user can rate their own query
    ON query_feedback FOR INSERT
    WITH CHECK (
        auth.uid() = (SELECT user_id FROM query_history WHERE id = query_id)
    );

-- Subquery RLS: verifies ownership through the related query_history row
CREATE POLICY "Users can update own feedback"    -- UPDATE: user can change their feedback
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
CREATE TABLE IF NOT EXISTS user_repos (          -- Tracks which repos a user has indexed
    id              BIGSERIAL PRIMARY KEY,        -- Internal row ID
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- FK → users
    repo_url        TEXT NOT NULL,                 -- Full Git remote URL
    repo_name       TEXT,                          -- Human-readable name (e.g. "owner/repo")
    branch          TEXT DEFAULT 'main',           -- Branch that was ingested
    status          TEXT DEFAULT 'completed'       -- Ingestion pipeline status
                        CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    chunks_count    INTEGER DEFAULT 0,             -- Number of code chunks produced from this repo
    error_message   TEXT,                          -- Error detail if status = 'failed'
    created_at      TIMESTAMPTZ DEFAULT NOW(),    -- When the repo was first added
    updated_at      TIMESTAMPTZ DEFAULT NOW(),    -- Last status change (trigger-managed)
    UNIQUE(user_id, repo_url)                     -- Prevent duplicate indexing of the same repo
);

CREATE TRIGGER set_user_repos_updated_at
    BEFORE UPDATE ON user_repos
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE INDEX idx_user_repos_user_created          -- Fast lookup: user's repos, most recent first
    ON user_repos(user_id, created_at DESC);

ALTER TABLE user_repos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own repos"         -- SELECT: users see only their own repos
    ON user_repos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repos"       -- INSERT: users can register repos for indexing
    ON user_repos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 6. USER ACTIVITY LOG — audit trail for significant events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_activity_log (   -- Immutable audit log for security & debugging
    id          BIGSERIAL PRIMARY KEY,            -- Unique event ID
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- FK → users
    action      TEXT NOT NULL,                     -- Event name (e.g. 'login', 'repo_deleted')
    details     JSONB,                             -- Arbitrary structured event payload
    ip_address  TEXT,                              -- Originating IP address
    created_at  TIMESTAMPTZ DEFAULT NOW()         -- When the event occurred
);

CREATE INDEX idx_activity_user_created            -- Fast lookup: recent events per user
    ON user_activity_log(user_id, created_at DESC);

CREATE INDEX idx_activity_action                  -- Analytics: aggregate by action type
    ON user_activity_log(action);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own activity; insert allowed for service_role
CREATE POLICY "Users can read own activity"      -- SELECT: users see only their own events
    ON user_activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert activity" -- INSERT: backend writes event log entries
    ON user_activity_log FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- Helper functions
-- ============================================================================

-- Create user profile + preferences on first sign-in
CREATE OR REPLACE FUNCTION handle_new_user()    -- Called by trigger after auth.users INSERT
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name, avatar_url)  -- Create the user's profile row
    VALUES (
        NEW.id,                                       -- Use the auth UID directly
        NEW.email,                                    -- Copy email from auth
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email, ''),  -- Prefer OAuth full_name
        NEW.raw_user_meta_data ->> 'avatar_url'       -- Copy avatar if provided
    );

    INSERT INTO user_preferences (user_id)            -- Create default preferences row
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;                 -- SECURITY DEFINER: runs with function owner's privileges

-- Trigger: auto-create profile when a user signs up via Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;  -- Idempotent: drop first to allow re-runs
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users                        -- Fires after a new auth user is created
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
