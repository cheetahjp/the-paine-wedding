-- ============================================================
-- GUEST LIST SEED DATA
-- Run this in the Supabase SQL Editor to load all guests.
-- Safe to run multiple times (uses ON CONFLICT DO NOTHING).
-- Generated from: Guest List - Formatted for Website.csv
-- Households: 85 | Guests: 178
-- ============================================================

DO $$
DECLARE
  hh_id UUID;
BEGIN

  -- Callie's Family (1 guest)
  INSERT INTO households (name)
  VALUES ('Callie''s Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Callie', 'TBD', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Adams Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Adams Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Emma', 'Adams', NULL, NULL),
    (hh_id, 'Sarah', 'Adams', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Alvarez Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Alvarez Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Liz', 'Alvarez', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Armstrong Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Armstrong Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Becky', 'Armstrong', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Arnold Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Arnold Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Meichell', 'Arnold', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Bardin Family (4 guests)
  INSERT INTO households (name)
  VALUES ('The Bardin Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Brad', 'Bardin', NULL, NULL),
    (hh_id, 'Brent', 'Bardin', NULL, NULL),
    (hh_id, 'Dylan', 'Bardin', NULL, NULL),
    (hh_id, 'Emily', 'Bardin', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Bimmerle Family (6 guests)
  INSERT INTO households (name)
  VALUES ('The Bimmerle Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Blake', 'Bimmerle', NULL, NULL),
    (hh_id, 'John', 'Bimmerle', NULL, NULL),
    (hh_id, 'Katie', 'Bimmerle', NULL, NULL),
    (hh_id, 'Paige', 'Bimmerle', NULL, NULL),
    (hh_id, 'Rachel', 'Bimmerle', NULL, NULL),
    (hh_id, 'Tom', 'Bimmerle', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Bishop Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Bishop Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Angie', 'Bishop', NULL, NULL),
    (hh_id, 'Mike', 'Bishop', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Blackwood Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Blackwood Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Kim', 'Blackwood', NULL, NULL),
    (hh_id, 'Nathan', 'Blackwood', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Boyd Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Boyd Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Abby', 'Boyd', NULL, NULL),
    (hh_id, 'Hudson', 'Boyd', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Brown Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Brown Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Katey', 'Brown', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Cary Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Cary Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Amy', 'Cary', NULL, NULL),
    (hh_id, 'Steve', 'Cary', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Cavagnaro Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Cavagnaro Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Ethan', 'Cavagnaro', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Coffey Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Coffey Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Carter', 'Coffey', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Coppo Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Coppo Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Karen', 'Coppo', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Crawford Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Crawford Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Kyla', 'Crawford', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Cress Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Cress Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Joe', 'Cress', NULL, NULL),
    (hh_id, 'Lachelle', 'Cress', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Dover Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Dover Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Clay', 'Dover', NULL, NULL),
    (hh_id, 'Rebecca', 'Dover', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Eaton Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Eaton Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Tandra', 'Eaton', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Edwards Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Edwards Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Dani', 'Edwards', NULL, NULL),
    (hh_id, 'Josh', 'Edwards', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Fiance Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Fiance Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'David''s', 'Fiance', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Finforck Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Finforck Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Paul', 'Finforck', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Finfrock Family (3 guests)
  INSERT INTO households (name)
  VALUES ('The Finfrock Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Duane', 'Finfrock', NULL, NULL),
    (hh_id, 'Kathy', 'Finfrock', NULL, NULL),
    (hh_id, 'Pat', 'Finfrock', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Francis Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Francis Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Ethan', 'Francis', NULL, NULL),
    (hh_id, 'Julie', 'Francis', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Franks Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Franks Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Hannah', 'Franks', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Fruge Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Fruge Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Axlyn', 'Fruge', NULL, NULL),
    (hh_id, 'Travis', 'Fruge', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Gerner Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Gerner Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Shelby', 'Gerner', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Gonzales Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Gonzales Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Jeremy', 'Gonzales', NULL, NULL),
    (hh_id, 'Sam', 'Gonzales', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Gribnitz Family (5 guests)
  INSERT INTO households (name)
  VALUES ('The Gribnitz Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Abigail', 'Gribnitz', NULL, NULL),
    (hh_id, 'Hannah', 'Gribnitz', NULL, NULL),
    (hh_id, 'Jim', 'Gribnitz', NULL, NULL),
    (hh_id, 'Nikki', 'Gribnitz', NULL, NULL),
    (hh_id, 'Seth', 'Gribnitz', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Groezinger Family (5 guests)
  INSERT INTO households (name)
  VALUES ('The Groezinger Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Collin', 'Groezinger', NULL, NULL),
    (hh_id, 'Jason', 'Groezinger', NULL, NULL),
    (hh_id, 'Julanne', 'Groezinger', NULL, NULL),
    (hh_id, 'Megan', 'Groezinger', NULL, NULL),
    (hh_id, 'Moises', 'Groezinger', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Halverson Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Halverson Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Marissa', 'Halverson', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Hawkins Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Hawkins Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Reagan', 'Hawkins', NULL, NULL),
    (hh_id, 'Summer', 'Hawkins', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Hearn Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Hearn Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Kathy', 'Hearn', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Hoops Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Hoops Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Cary', 'Hoops', NULL, NULL),
    (hh_id, 'Rocki', 'Hoops', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Horne Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Horne Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Amanda', 'Horne', NULL, NULL),
    (hh_id, 'Ryan', 'Horne', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Hortan Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Hortan Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Susan', 'Hortan', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Horton Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Horton Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Chris', 'Horton', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Howard Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Howard Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Les', 'Howard', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Howe Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Howe Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'David', 'Howe', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The husband Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The husband Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Callie''s', 'husband', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Isom Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Isom Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Emma', 'Isom', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Jwanouskos Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Jwanouskos Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Samantha', 'Jwanouskos', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Kassady Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Kassady Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Casey', 'Kassady', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Kirkpatrick Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Kirkpatrick Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Jason', 'Kirkpatrick', NULL, NULL),
    (hh_id, 'Kimberly', 'Kirkpatrick', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Lawson Family (4 guests)
  INSERT INTO households (name)
  VALUES ('The Lawson Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Greg', 'Lawson', NULL, NULL),
    (hh_id, 'Natalie', 'Lawson', NULL, NULL),
    (hh_id, 'Sally', 'Lawson', NULL, NULL),
    (hh_id, 'Whitney', 'Lawson', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Lord Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Lord Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Jackson', 'Lord', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Luna Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Luna Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Carlos', 'Luna', NULL, NULL),
    (hh_id, 'Zayda', 'Luna', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Luurtsema Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Luurtsema Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Justin', 'Luurtsema', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Lynch Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Lynch Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Kate', 'Lynch', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Marshall Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Marshall Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Caitlin', 'Marshall', NULL, NULL),
    (hh_id, 'Duncan', 'Marshall', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The May Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The May Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Izzy', 'May', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Meirovitz Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Meirovitz Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Casey', 'Meirovitz', NULL, NULL),
    (hh_id, 'Jolynn', 'Meirovitz', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Moore Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Moore Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Macie', 'Moore', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The newLastName Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The newLastName Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Anna', 'newLastName', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Ostryzniuk Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Ostryzniuk Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Alice', 'Ostryzniuk', NULL, NULL),
    (hh_id, 'Bernie', 'Ostryzniuk', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Owen Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Owen Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Bruce', 'Owen', NULL, NULL),
    (hh_id, 'Lori', 'Owen', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Paine Family (10 guests)
  INSERT INTO households (name)
  VALUES ('The Paine Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Hillary', 'Paine', NULL, NULL),
    (hh_id, 'Jennifer', 'Paine', NULL, NULL),
    (hh_id, 'John', 'Paine', NULL, NULL),
    (hh_id, 'John', 'Paine', '3', NULL),
    (hh_id, 'Josh', 'Paine', NULL, NULL),
    (hh_id, 'Joshua', 'Paine', NULL, NULL),
    (hh_id, 'Margret', 'Paine', NULL, NULL),
    (hh_id, 'Sam', 'Paine', NULL, NULL),
    (hh_id, 'Sandy', 'Paine', NULL, NULL),
    (hh_id, 'Schyler', 'Paine', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Peck Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Peck Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Rachel', 'Peck', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Pizzarello Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Pizzarello Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Iris', 'Pizzarello', NULL, NULL),
    (hh_id, 'Nico', 'Pizzarello', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Potoeschnik Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Potoeschnik Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Jonathan', 'Potoeschnik', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Preston Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Preston Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Connor', 'Preston', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Proctor Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Proctor Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Angie', 'Proctor', NULL, NULL),
    (hh_id, 'Richard', 'Proctor', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Raines Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Raines Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Kayla', 'Raines', NULL, NULL),
    (hh_id, 'Will', 'Raines', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Ray Family (5 guests)
  INSERT INTO households (name)
  VALUES ('The Ray Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Dustin', 'Ray', NULL, NULL),
    (hh_id, 'Eddie', 'Ray', NULL, NULL),
    (hh_id, 'Joann', 'Ray', NULL, NULL),
    (hh_id, 'Megan', 'Ray', NULL, NULL),
    (hh_id, 'Vicky', 'Ray', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Redell Family (5 guests)
  INSERT INTO households (name)
  VALUES ('The Redell Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Brendan', 'Redell', NULL, NULL),
    (hh_id, 'Caroline', 'Redell', NULL, NULL),
    (hh_id, 'Kalina', 'Redell', NULL, NULL),
    (hh_id, 'Lisa', 'Redell', NULL, NULL),
    (hh_id, 'Ron', 'Redell', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Redell? Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Redell? Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Macie', 'Redell?', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Reece Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Reece Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'John', 'Reece', NULL, NULL),
    (hh_id, 'Kimberly', 'Reece', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Reid Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Reid Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Elaine', 'Reid', NULL, NULL),
    (hh_id, 'Jeff', 'Reid', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Richichi Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Richichi Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Olivia', 'Richichi', NULL, NULL),
    (hh_id, 'Roman', 'Richichi', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Robertson Family (8 guests)
  INSERT INTO households (name)
  VALUES ('The Robertson Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Adley', 'Robertson', NULL, NULL),
    (hh_id, 'Alyse', 'Robertson', NULL, NULL),
    (hh_id, 'Christy', 'Robertson', NULL, NULL),
    (hh_id, 'Keith', 'Robertson', NULL, NULL),
    (hh_id, 'Reese', 'Robertson', NULL, NULL),
    (hh_id, 'Ryan', 'Robertson', NULL, NULL),
    (hh_id, 'Sydney', 'Robertson', NULL, NULL),
    (hh_id, 'Tyler', 'Robertson', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Runyon Family (8 guests)
  INSERT INTO households (name)
  VALUES ('The Runyon Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Audrey', 'Runyon', NULL, NULL),
    (hh_id, 'Charlie', 'Runyon', NULL, NULL),
    (hh_id, 'Maggie', 'Runyon', NULL, NULL),
    (hh_id, 'Mary', 'Runyon', NULL, NULL),
    (hh_id, 'Matthew', 'Runyon', NULL, NULL),
    (hh_id, 'Megan', 'Runyon', NULL, NULL),
    (hh_id, 'Tom', 'Runyon', NULL, NULL),
    (hh_id, 'Tommy', 'Runyon', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Santillan Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Santillan Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Alondra', 'Santillan', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Simpson Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Simpson Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Jen', 'Simpson', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Smith Family (4 guests)
  INSERT INTO households (name)
  VALUES ('The Smith Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Greg', 'Smith', NULL, NULL),
    (hh_id, 'Heidi', 'Smith', NULL, NULL),
    (hh_id, 'Holly', 'Smith', NULL, NULL),
    (hh_id, 'Lisa', 'Smith', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Stevenson Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Stevenson Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Carley', 'Stevenson', NULL, NULL),
    (hh_id, 'Jason', 'Stevenson', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Taylor Family (6 guests)
  INSERT INTO households (name)
  VALUES ('The Taylor Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Bryan', 'Taylor', NULL, NULL),
    (hh_id, 'Brylan', 'Taylor', NULL, NULL),
    (hh_id, 'Cailey', 'Taylor', NULL, NULL),
    (hh_id, 'Jennifer', 'Taylor', NULL, NULL),
    (hh_id, 'Nathan', 'Taylor', NULL, NULL),
    (hh_id, 'Trent', 'Taylor', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Tesfaye Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Tesfaye Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Joe', 'Tesfaye', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Walker Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Walker Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Renee', 'Walker', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Washburn Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Washburn Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Sydney', 'Washburn', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Welling Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Welling Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Frank', 'Welling', NULL, NULL),
    (hh_id, 'Renee', 'Welling', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Westbrook Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Westbrook Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Kaden', 'Westbrook', NULL, NULL),
    (hh_id, 'Kaitlyn', 'Westbrook', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Wilson Family (3 guests)
  INSERT INTO households (name)
  VALUES ('The Wilson Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Ainsley', 'Wilson', NULL, NULL),
    (hh_id, 'Brynn', 'Wilson', NULL, NULL),
    (hh_id, 'Emma', 'Wilson', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Wilt Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Wilt Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Lynnett', 'Wilt', NULL, NULL),
    (hh_id, 'Scott', 'Wilt', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Word Family (1 guest)
  INSERT INTO households (name)
  VALUES ('The Word Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames)
  VALUES (hh_id, 'Gay', 'Word', NULL, NULL)
  ON CONFLICT DO NOTHING;

  -- The Young Family (2 guests)
  INSERT INTO households (name)
  VALUES ('The Young Family')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO hh_id;

  INSERT INTO guests (household_id, first_name, last_name, suffix, nicknames) VALUES
    (hh_id, 'Donna', 'Young', NULL, NULL),
    (hh_id, 'Peter', 'Young', NULL, NULL)
  ON CONFLICT DO NOTHING;

END $$;

-- Verify the import
SELECT COUNT(*) as total_guests FROM guests;
SELECT COUNT(*) as total_households FROM households;