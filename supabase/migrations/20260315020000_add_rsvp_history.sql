-- Migration: RSVP response history / audit log
-- Every time a guest submits (or re-submits) their RSVP, one row per guest
-- is inserted here so the admin can see a timeline of changes.
--
-- Run in Supabase SQL editor → https://supabase.com/dashboard/project/khqmbphkdmexkknzvtgb/sql

CREATE TABLE IF NOT EXISTS rsvp_history (
  id             uuid      DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id       uuid      NOT NULL REFERENCES guests(id)     ON DELETE CASCADE,
  household_id   uuid      NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  recorded_at    timestamptz DEFAULT timezone('utc', now()) NOT NULL,

  -- Snapshot of what the guest submitted at this point in time
  attending      boolean,
  food_allergies text,
  song_request   text,
  advice         text
);

-- Fast look-ups for admin views
CREATE INDEX IF NOT EXISTS rsvp_history_guest_idx       ON rsvp_history (guest_id);
CREATE INDEX IF NOT EXISTS rsvp_history_household_idx   ON rsvp_history (household_id);
CREATE INDEX IF NOT EXISTS rsvp_history_recorded_at_idx ON rsvp_history (recorded_at DESC);

COMMENT ON TABLE rsvp_history IS
  'Audit log: one row per guest per RSVP submission. Never deleted, only appended.';
