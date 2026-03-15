-- Migration: Create trivia_questions table and seed with initial questions
-- Used by the Couple Trivia game and the admin trivia CRUD interface

CREATE TABLE IF NOT EXISTS trivia_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt text NOT NULL,
  answer_a text NOT NULL,
  answer_b text NOT NULL,
  answer_c text NOT NULL,
  answer_d text NOT NULL,
  correct_index integer NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  fun_fact text DEFAULT null,
  sort_order integer NOT NULL DEFAULT 0,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_trivia_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trivia_questions_updated_at
  BEFORE UPDATE ON trivia_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_trivia_updated_at();

-- Seed initial questions
INSERT INTO trivia_questions (prompt, answer_a, answer_b, answer_c, answer_d, correct_index, fun_fact, sort_order) VALUES
  (
    'Who said "I love you" first?',
    'Jeffrey', 'Ashlyn', 'They said it together', 'Nobody remembers',
    0,
    'Jeffrey got there first.',
    1
  ),
  (
    'Who is the better cook?',
    'Jeffrey', 'Ashlyn', 'They are evenly matched', 'Whoever orders takeout',
    1,
    'Ashlyn holds the edge in the kitchen.',
    2
  ),
  (
    'Where was their first official date?',
    'Sonic and a long drive', 'Galveston Bay Brewing', '60 Vines', 'An A&M football game',
    0,
    'Their first official date was simple and turned into hours of conversation.',
    3
  ),
  (
    'Which movie is one of their favorites together?',
    'Pride & Prejudice', 'Interstellar', 'The Notebook', 'Inception',
    3,
    'Inception made the official favorites list.',
    4
  ),
  (
    'Who takes longer to get ready?',
    'Jeffrey', 'Ashlyn', 'They tie', 'It depends on the day',
    1,
    'Ashlyn takes the longer getting-ready route.',
    5
  ),
  (
    'Where did Ashlyn and Jeffrey first meet?',
    'Texas A&M University-Commerce', 'Davis & Grey Farms', 'Arbor Hills', 'Galveston Bay Brewing',
    0,
    'It started with an ice cream social at Texas A&M University-Commerce in 2021.',
    6
  ),
  (
    'How far did Jeffrey drive for their reunion date in Houston?',
    '2 hours', '3 hours', '4.5 hours', '6 hours',
    2,
    'Jeffrey made the four-and-a-half-hour drive for the reunion date.',
    7
  ),
  (
    'Where did Jeffrey propose?',
    '60 Vines', 'Arbor Hills Nature Preserve', 'Davis & Grey Farms', 'At an A&M game',
    1,
    'Ashlyn was guided down the path at Arbor Hills before seeing Jeffrey waiting there.',
    8
  ),
  (
    'When did they officially start dating again?',
    'August 2024', 'October 18, 2024', 'February 21, 2026', 'September 26, 2026',
    1,
    'After reconnecting, they officially started dating again on October 18, 2024.',
    9
  ),
  (
    'At the football game, how far apart were they sitting?',
    'One row', 'Three rows', 'Five rows', 'Ten rows',
    2,
    'Out of 100,000 people, they ended up only five rows apart.',
    10
  );

COMMENT ON TABLE trivia_questions IS 'Couple trivia questions for the wedding games section. Managed via the admin panel.';
