CREATE TABLE IF NOT EXISTS game_players (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  username text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  game text NOT NULL CHECK (game IN ('trivia', 'painedle')),
  puzzle_key text NOT NULL DEFAULT '',
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  max_score integer,
  attempts integer,
  solved boolean,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (player_id, game, puzzle_key)
);

CREATE INDEX IF NOT EXISTS game_scores_game_puzzle_score_idx
  ON game_scores (game, puzzle_key, score DESC, attempts ASC, created_at ASC);
