-- Migration: Set default page visibility for admin-controlled pages
-- Schedule and Details are hidden by default until admin makes them public.

INSERT INTO site_settings (key, value)
VALUES
    ('page.schedule.hidden',        'true'),
    ('page.wedding-details.hidden', 'true')
ON CONFLICT (key) DO NOTHING;
