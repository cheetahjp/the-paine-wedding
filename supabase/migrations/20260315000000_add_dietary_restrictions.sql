-- Migration: Add per-guest dietary_restrictions column
-- Replaces the household-level food_allergies field with per-guest dietary info.
-- The old food_allergies column is kept for backwards compatibility.

ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT;

COMMENT ON COLUMN guests.dietary_restrictions IS 'Per-guest dietary restrictions or food allergies entered at RSVP (replaces household-level food_allergies)';
