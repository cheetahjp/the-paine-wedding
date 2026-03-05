-- Create households table
CREATE TABLE households (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create guests table
CREATE TABLE guests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  nicknames text DEFAULT null,
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  plus_one_allowed boolean DEFAULT false,
  attending boolean DEFAULT null,
  meal_choice text DEFAULT null,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Enable RLS and setup policies from Supabase Dashboard when connecting.
