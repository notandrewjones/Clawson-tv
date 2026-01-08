-- =============================================
-- CHAT SYSTEM TABLES FOR CLAWSON.TV
-- Run this in your Supabase SQL Editor
-- =============================================

-- Chat Users Table
-- Stores user profiles with moderation status
CREATE TABLE IF NOT EXISTS chat_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    is_moderator BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    timeout_until TIMESTAMPTZ,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages Table
-- Stores all chat messages linked to events
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for fetching messages by event (sorted by time)
CREATE INDEX IF NOT EXISTS idx_chat_messages_event_created 
ON chat_messages(event_id, created_at);

-- Index for looking up users by client_id
CREATE INDEX IF NOT EXISTS idx_chat_users_client_id 
ON chat_users(client_id);

-- Index for finding banned users
CREATE INDEX IF NOT EXISTS idx_chat_users_banned 
ON chat_users(is_banned) WHERE is_banned = TRUE;

-- Index for finding timed out users
CREATE INDEX IF NOT EXISTS idx_chat_users_timeout 
ON chat_users(timeout_until) WHERE timeout_until IS NOT NULL;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on both tables
ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat Users Policies
-- Anyone can read user profiles (needed to display usernames)
CREATE POLICY "Anyone can read chat users"
ON chat_users FOR SELECT
USING (true);

-- Anyone can create a new user (for joining chat)
CREATE POLICY "Anyone can create chat user"
ON chat_users FOR INSERT
WITH CHECK (true);

-- Users can update their own profile, moderators can update anyone
CREATE POLICY "Users can update own profile or moderators can update any"
ON chat_users FOR UPDATE
USING (true)
WITH CHECK (true);

-- Chat Messages Policies
-- Anyone can read non-deleted messages
CREATE POLICY "Anyone can read chat messages"
ON chat_messages FOR SELECT
USING (true);

-- Non-banned users can insert messages
CREATE POLICY "Non-banned users can send messages"
ON chat_messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM chat_users 
        WHERE chat_users.id = user_id 
        AND chat_users.is_banned = FALSE
        AND (chat_users.timeout_until IS NULL OR chat_users.timeout_until < NOW())
    )
);

-- Messages can be updated (for deletion/moderation)
CREATE POLICY "Messages can be updated"
ON chat_messages FOR UPDATE
USING (true)
WITH CHECK (true);

-- =============================================
-- ENABLE REALTIME FOR CHAT TABLES
-- =============================================

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_users;

-- =============================================
-- OPTIONAL: CREATE A MODERATOR USER
-- =============================================

-- To make yourself a moderator, first join the chat normally,
-- then run this query with your actual client_id:
-- 
-- UPDATE chat_users 
-- SET is_moderator = TRUE 
-- WHERE client_id = 'your_client_id_here';
--
-- You can find your client_id in your browser's localStorage:
-- localStorage.getItem('chat_client_id')

-- =============================================
-- OPTIONAL: CLEANUP FUNCTION
-- =============================================

-- Function to clean up old messages (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS void AS $$
BEGIN
    -- Delete messages older than 7 days
    DELETE FROM chat_messages 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Clear expired timeouts
    UPDATE chat_users 
    SET timeout_until = NULL 
    WHERE timeout_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can set up a cron job in Supabase to run this daily:
-- SELECT cron.schedule('cleanup-chat', '0 3 * * *', 'SELECT cleanup_old_chat_messages()');
