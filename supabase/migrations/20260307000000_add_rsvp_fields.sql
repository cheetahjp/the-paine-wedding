-- Migration: Add food_allergies, song_request, and advice to guests table
-- Run this in the Supabase SQL editor or via the Supabase CLI

ALTER TABLE guests
  ADD COLUMN IF NOT EXISTS food_allergies TEXT,
  ADD COLUMN IF NOT EXISTS song_request TEXT,
  ADD COLUMN IF NOT EXISTS advice TEXT;

-- Add comments for documentation
COMMENT ON COLUMN guests.food_allergies IS 'Food allergies or dietary restrictions reported at RSVP';
COMMENT ON COLUMN guests.song_request IS 'Song request for the reception (entered at RSVP)';
COMMENT ON COLUMN guests.advice IS 'Marriage advice submitted by the guest at RSVP';
