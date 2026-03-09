-- trivia_questions table
-- Questions are managed via the admin panel and served to the game page.
-- sort_order controls display sequence; archived rows are hidden from the game.

CREATE TABLE IF NOT EXISTS trivia_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    answer_a TEXT NOT NULL,
    answer_b TEXT NOT NULL,
    answer_c TEXT NOT NULL,
    answer_d TEXT NOT NULL,
    correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
    fun_fact TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trivia_questions_updated_at
    BEFORE UPDATE ON trivia_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: enable row-level security
ALTER TABLE trivia_questions ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only read non-archived questions
CREATE POLICY "anon_select_active_trivia_questions"
    ON trivia_questions
    FOR SELECT
    TO anon
    USING (archived = false);

-- Service role has full access (used by admin API routes)
CREATE POLICY "service_role_all_trivia_questions"
    ON trivia_questions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Seed with the 10 existing questions from trivia-questions.ts
INSERT INTO trivia_questions (prompt, answer_a, answer_b, answer_c, answer_d, correct_index, fun_fact, sort_order) VALUES
(
    'Who said "I love you" first?',
    'Jeff',
    'Ashlyn',
    'They said it together',
    'Nobody remembers',
    0,
    'Jeff got there first.',
    1
),
(
    'Who is the better cook?',
    'Jeff',
    'Ashlyn',
    'They are evenly matched',
    'Whoever orders takeout',
    1,
    'Ashlyn holds the edge in the kitchen.',
    2
),
(
    'Where was their first official date?',
    'Sonic and a long drive',
    'Galveston Bay Brewing',
    '60 Vines',
    'An A&M football game',
    0,
    'Their first official date was simple and turned into hours of conversation.',
    3
),
(
    'Which movie is one of their favorites together?',
    'Pride & Prejudice',
    'Interstellar',
    'The Notebook',
    'Inception',
    3,
    'Inception made the official favorites list.',
    4
),
(
    'Who takes longer to get ready?',
    'Jeff',
    'Ashlyn',
    'They tie',
    'It depends on the day',
    1,
    'Ashlyn takes the longer getting-ready route.',
    5
),
(
    'Where did Jeff and Ashlyn first meet?',
    'Texas A&M University-Commerce',
    'Davis & Grey Farms',
    'Arbor Hills',
    'Galveston Bay Brewing',
    0,
    'It started with an ice cream social at Texas A&M University-Commerce in 2021.',
    6
),
(
    'How far did Jeff drive for their reunion date in Houston?',
    '2 hours',
    '3 hours',
    '4.5 hours',
    '6 hours',
    2,
    'Jeff made the four-and-a-half-hour drive for the reunion date.',
    7
),
(
    'Where did Jeff propose?',
    '60 Vines',
    'Arbor Hills Nature Preserve',
    'Davis & Grey Farms',
    'At an A&M game',
    1,
    'Ashlyn was guided down the path at Arbor Hills before seeing Jeff waiting there.',
    8
),
(
    'When did they officially start dating again?',
    'August 2024',
    'October 18, 2024',
    'February 21, 2026',
    'September 26, 2026',
    1,
    'After reconnecting, they officially started dating again on October 18, 2024.',
    9
),
(
    'At the football game, how far apart were they sitting?',
    'One row',
    'Three rows',
    'Five rows',
    'Ten rows',
    2,
    'Out of 100,000 people, they ended up only five rows apart.',
    10
);
