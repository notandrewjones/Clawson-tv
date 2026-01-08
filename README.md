# Clawson.TV Livestream Chat

Real-time chat system for Clawson.TV livestreams, powered by Supabase.

## Features

- Real-time chat messaging
- Username persistence via cookies
- Moderation tools (delete, timeout, ban)
- Cue system integration for dynamic content banners
- Resi video player integration

## Setup

### 1. Supabase Setup

Run the SQL migration in your Supabase project's SQL Editor:

```sql
-- See supabase_chat_migration.sql for full schema
```

### 2. Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `RESI_EMBED_ID` | Your Resi player embed ID |

### 3. Deploy to Vercel

```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Local Development

1. Copy `.env.example` to `.env.local` and fill in your values
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Serve: `npm run dev`

## Making Someone a Moderator

1. Have them join the chat first
2. Find their `client_id` (they can run `localStorage.getItem('chat_client_id')` in browser console)
3. Run in Supabase SQL Editor:

```sql
UPDATE chat_users 
SET is_moderator = TRUE 
WHERE client_id = 'their_client_id_here';
```

## Project Structure

```
├── src/
│   └── index.html      # Source template with env placeholders
├── public/
│   └── index.html      # Built output (gitignored)
├── build.js            # Build script that injects env vars
├── vercel.json         # Vercel configuration
└── supabase_chat_migration.sql  # Database schema
```
