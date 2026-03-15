-- Migration: Create rsvp_history table for tracking RSVP submission history
-- Each time a guest submits or updates their RSVP, a new row is inserted (fire-and-forget).
-- This gives us a full audit trail of changes without overwriting the live data.

CREATE TABLE IF NOT EXISTS rsvp_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id uuid REFERENCES guests(id) ON DELETE SET NULL,
  household_id uuid REFERENCES households(id) ON DELETE SET NULL,
  recorded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  attending boolean DEFAULT null,
  food_allergies text DEFAULT null,
  song_request text DEFAULT null,
  advice text DEFAULT null
);

-- Index for looking up history by guest or household
CREATE INDEX IF NOT EXISTS rsvp_history_guest_id_idx ON rsvp_history(guest_id);
CREATE INDEX IF NOT EXISTS rsvp_history_household_id_idx ON rsvp_history(household_id);
CREATE INDEX IF NOT EXISTS rsvp_history_recorded_at_idx ON rsvp_history(recorded_at DESC);

COMMENT ON TABLE rsvp_history IS 'Append-only log of every RSVP submission. Each submit from the front-end inserts a row per guest. Used to track changes over time.';
COMMENT ON COLUMN rsvp_history.attending IS 'Attending status at time of submission (null = not yet set)';
COMMENT ON COLUMN rsvp_history.food_allergies IS 'Food allergies/dietary restrictions at time of submission';
COMMENT ON COLUMN rsvp_history.song_request IS 'Song request at time of submission';
COMMENT ON COLUMN rsvp_history.advice IS 'Marriage advice at time of submission';
