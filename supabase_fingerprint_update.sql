-- =============================================
-- FINGERPRINT BAN SYSTEM UPDATE
-- Run this if you already have the chat tables created
-- =============================================

-- Add fingerprint column to existing chat_users table
ALTER TABLE chat_users 
ADD COLUMN IF NOT EXISTS fingerprint TEXT;

-- Create index for fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_chat_users_fingerprint 
ON chat_users(fingerprint);

-- Create banned fingerprints table
CREATE TABLE IF NOT EXISTS banned_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint TEXT UNIQUE NOT NULL,
    banned_by UUID REFERENCES chat_users(id),
    original_username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for banned fingerprints
CREATE INDEX IF NOT EXISTS idx_banned_fingerprints 
ON banned_fingerprints(fingerprint);

-- Enable RLS
ALTER TABLE banned_fingerprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for banned_fingerprints
CREATE POLICY "Anyone can read banned fingerprints"
ON banned_fingerprints FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert banned fingerprints"
ON banned_fingerprints FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete banned fingerprints"
ON banned_fingerprints FOR DELETE
USING (true);

-- Add to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE banned_fingerprints;

-- =============================================
-- SERVER-SIDE BAN CHECK FUNCTION
-- This runs on every message insert and cannot be bypassed
-- =============================================

CREATE OR REPLACE FUNCTION check_user_ban_status()
RETURNS TRIGGER AS $$
DECLARE
    user_record RECORD;
    fingerprint_banned BOOLEAN;
BEGIN
    -- Get the user's info
    SELECT is_banned, fingerprint, timeout_until 
    INTO user_record
    FROM chat_users 
    WHERE id = NEW.user_id;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Check if user is directly banned
    IF user_record.is_banned THEN
        RAISE EXCEPTION 'User is banned';
    END IF;
    
    -- Check if user is timed out
    IF user_record.timeout_until IS NOT NULL AND user_record.timeout_until > NOW() THEN
        RAISE EXCEPTION 'User is timed out';
    END IF;
    
    -- Check if user's fingerprint is in the banned list
    IF user_record.fingerprint IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM banned_fingerprints 
            WHERE fingerprint = user_record.fingerprint
        ) INTO fingerprint_banned;
        
        IF fingerprint_banned THEN
            -- Also mark the user as banned for consistency
            UPDATE chat_users SET is_banned = TRUE WHERE id = NEW.user_id;
            RAISE EXCEPTION 'Device is banned';
        END IF;
    END IF;
    
    -- All checks passed, allow the insert
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that runs before every message insert
DROP TRIGGER IF EXISTS enforce_ban_check ON chat_messages;
CREATE TRIGGER enforce_ban_check
    BEFORE INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION check_user_ban_status();
