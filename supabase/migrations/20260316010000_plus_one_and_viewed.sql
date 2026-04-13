-- Track viewed RSVP (opened form but may not have submitted)
ALTER TABLE guests ADD COLUMN IF NOT EXISTS viewed_rsvp BOOLEAN NOT NULL DEFAULT false;

-- Plus one tracking
ALTER TABLE guests ADD COLUMN IF NOT EXISTS is_plus_one BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_one_for_id UUID REFERENCES guests(id) ON DELETE SET NULL;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS plus_one_claimed BOOLEAN NOT NULL DEFAULT false;
