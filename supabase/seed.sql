-- Seed Data for The Paine Wedding

-- 1. Insert Households
WITH new_households AS (
    INSERT INTO households (name)
    VALUES 
        ('The Paine Family'),
        ('The Bimmerle Family')
    RETURNING id, name
)
-- 2. Insert Guests and link to the generated UUIDs
INSERT INTO guests (first_name, last_name, household_id)
SELECT 'Jeffrey', 'Paine', id FROM new_households WHERE name = 'The Paine Family'
UNION ALL
SELECT 'John', 'Paine', id FROM new_households WHERE name = 'The Paine Family'
UNION ALL
SELECT 'Jennifer', 'Paine', id FROM new_households WHERE name = 'The Paine Family'
UNION ALL
SELECT 'John', 'Paine III', id FROM new_households WHERE name = 'The Paine Family'
UNION ALL
SELECT 'Ashlyn', 'Bimmerle', id FROM new_households WHERE name = 'The Bimmerle Family';
