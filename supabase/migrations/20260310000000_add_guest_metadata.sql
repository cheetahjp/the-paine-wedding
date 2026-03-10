-- Migration: Add guest metadata columns for imported guest list
-- plus_one_name: the named plus-one from the guest list (admin reference)
-- affiliation:   Family | Our Friends | Their Friends
-- side:          Jeff | Ash | Both
-- likelihood:    Yes | Maybe | No  (likelihood they'll RSVP yes; admin only)

ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS plus_one_name   TEXT,
  ADD COLUMN IF NOT EXISTS affiliation     TEXT,
  ADD COLUMN IF NOT EXISTS side            TEXT,
  ADD COLUMN IF NOT EXISTS likelihood      TEXT;

-- Ensure households.name is unique (required for ON CONFLICT upserts)
-- Note: ADD CONSTRAINT doesn't support IF NOT EXISTS in Postgres — use a DO block instead
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'households_name_unique'
  ) THEN
    ALTER TABLE households ADD CONSTRAINT households_name_unique UNIQUE (name);
  END IF;
END $$;

COMMENT ON COLUMN guests.plus_one_name IS 'Name of the plus-one listed on the original guest list (admin reference only)';
COMMENT ON COLUMN guests.affiliation   IS 'Guest affiliation: Family | Our Friends | Their Friends';
COMMENT ON COLUMN guests.side          IS 'Which side of the couple: Jeff | Ash | Both';
COMMENT ON COLUMN guests.likelihood    IS 'Likelihood of attending per guest list: Yes | Maybe | No (admin only)';
