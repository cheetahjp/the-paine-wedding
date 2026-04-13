-- Migration: Replace all trivia questions with the verified real-story set (50 questions)
-- ⚠️  Questions marked "VERIFY" may have the wrong correct_index — check via admin panel.

DELETE FROM trivia_questions;

INSERT INTO trivia_questions
  (prompt, answer_a, answer_b, answer_c, answer_d, correct_index, fun_fact, sort_order)
VALUES

-- 1
(
  'At what kind of event did Jeff and Ashlyn first meet?',
  'A church retreat', 'A college ice cream social', 'A football tailgate', 'A birthday party',
  1,
  'They met at an ice cream social at A&M Commerce in 2021.',
  1
),

-- 2  ⚠️ VERIFY correct_index
(
  'Who originally wanted to be introduced when Jeff and Ashlyn first met?',
  'Jeff', 'Ashlyn', 'Both of them', 'A mutual friend decided on their own',
  3,
  NULL,
  2
),

-- 3
(
  'What did Jeff and Ashlyn do on their first official date the first time they dated?',
  'Fancy dinner downtown', 'Sonic and driving around talking for hours', 'Bowling and dessert', 'Coffee and a bookstore',
  1,
  'Simple, classic, and turned into hours of conversation.',
  3
),

-- 4
(
  'True or False: Jeff and Ashlyn first got together because they spent every day in the same friend group.',
  'True', 'False', '—', '—',
  1,
  'They met at a specific event — an ice cream social — not from daily friend group overlap.',
  4
),

-- 5  ⚠️ VERIFY correct_index
(
  'About how long did Jeff and Ashlyn date the first time before breaking up?',
  'About 3 months', 'About 6 months', 'About a year', 'About 2 years',
  1,
  NULL,
  5
),

-- 6
(
  'What was the main reason Jeff and Ashlyn broke up the first time they dated?',
  'One of them moved away', 'Family tension', 'They both needed to mature and grow with the Lord', 'School got too busy',
  2,
  'Sometimes the timing isn''t right — until it is.',
  6
),

-- 7  ⚠️ VERIFY correct_index
(
  'About how long did Jeff and Ashlyn go without seeing each other before randomly crossing paths again?',
  '6 months', '1 year', '2 years', '4 years',
  2,
  NULL,
  7
),

-- 8
(
  'Where did Jeff and Ashlyn unexpectedly see each other again after not seeing each other for a long time?',
  'At a wedding', 'At church', 'At an A&M football game', 'At a coffee shop',
  2,
  '100,000 people in that stadium — and they ended up just rows apart.',
  8
),

-- 9
(
  'At the A&M football game where Jeff and Ashlyn unexpectedly saw each other again, how close were they sitting?',
  'One row apart', 'Five rows apart', 'Opposite sides of the stadium', 'Right next to each other',
  1,
  'Five rows. Out of 100,000 people.',
  9
),

-- 10  ⚠️ VERIFY correct_index
(
  'What message did Jeff send after Jeff and Ashlyn unexpectedly saw each other again at the A&M football game?',
  '"We should grab dinner this week."', '"It was good to see you. I hope you''re doing well."', '"I still think about us."', '"I can''t believe that was you."',
  1,
  NULL,
  10
),

-- 11  ⚠️ VERIFY correct_index
(
  'During the season when Jeff and Ashlyn were reconnecting before getting back together, how often were they checking in with each other?',
  'Every day', 'Every week', 'Every month', 'Only on holidays',
  0,
  NULL,
  11
),

-- 12  ⚠️ VERIFY correct_index
(
  'In what month of 2024 did Jeff ask Ashlyn to hang out again during their reconnection season?',
  'June', 'August', 'October', 'December',
  2,
  NULL,
  12
),

-- 13
(
  'What happened when Jeff first asked Ashlyn to hang out again during their 2024 reconnection?',
  'She immediately said yes', 'She said no because she got nervous', 'She forgot to respond', 'She asked to just stay friends',
  1,
  'She turned him down — and then immediately regretted it.',
  13
),

-- 14
(
  'Why did Ashlyn turn Jeff down the first time Jeff asked her to hang out again in 2024?',
  'She was already dating someone else', 'She was out of town', 'She got nervous and was not sure it was a good idea', 'She thought he was joking',
  2,
  'Nerves — fair enough, given the history.',
  14
),

-- 15
(
  'After Ashlyn turned Jeff down the first time Jeff asked her to hang out again in 2024, what did Ashlyn do next?',
  'She stopped texting Jeff', 'She kept trying to text because she regretted shutting the door', 'She asked a friend to respond for her', 'She blocked his number for a week',
  1,
  'She changed her mind quickly.',
  15
),

-- 16
(
  'How far did Jeff drive to see Ashlyn when Jeff and Ashlyn finally hung out again during their reconnection in 2024?',
  '2 hours', '3 hours', '4.5 hours', '6 hours',
  2,
  'Worth every mile.',
  16
),

-- 17
(
  'What city did Jeff drive to when Jeff and Ashlyn finally hung out again during their reconnection in 2024?',
  'Austin', 'Houston', 'Waco', 'College Station',
  1,
  'A 4.5-hour drive to Houston — he was not playing around.',
  17
),

-- 18  ⚠️ VERIFY correct_index
(
  'Where did Jeff take Ashlyn when Jeff and Ashlyn finally hung out again during their reconnection in 2024?',
  '60 Vines', 'Galveston Bay Brewing', 'Sonic again', 'A coffee shop in Dallas',
  0,
  NULL,
  18
),

-- 19
(
  'How did Jeff and Ashlyn describe the first time they hung out again during their reconnection in 2024?',
  'Fun but awkward', 'Like no time had passed', 'Totally different and uncomfortable', 'More like catching up as friends',
  1,
  'Three years gone and it felt completely natural.',
  19
),

-- 20  ⚠️ VERIFY correct_index
(
  'When did Jeff and Ashlyn realize their first reconnection hangout in 2024 had turned into a real first date instead of just friends catching up?',
  'Before they even met up', 'Halfway through the meal', 'By the end of the night when they realized how well it went', 'A week later after talking about it',
  2,
  NULL,
  20
),

-- 21  ⚠️ VERIFY correct_index
(
  'On what date did Jeff and Ashlyn officially start dating again?',
  'August 18, 2024', 'September 26, 2024', 'October 18, 2024', 'February 21, 2025',
  2,
  NULL,
  21
),

-- 22
(
  'True or False: Most of Jeff and Ashlyn''s current relationship has been long distance.',
  'True', 'False', '—', '—',
  0,
  'They have made it work across hundreds of miles.',
  22
),

-- 23  ⚠️ VERIFY correct_index
(
  'What has been a normal rhythm of Jeff and Ashlyn''s long distance relationship?',
  'Visiting every other week', 'Only seeing each other on holidays', 'Daily lunch dates', 'Weekly flights',
  0,
  NULL,
  23
),

-- 24
(
  'Which description sounds the most like Jeff and Ashlyn''s long distance relationship?',
  'Mostly texting memes and not calling', 'Long car rides, Facetime calls, and hard goodbyes after good weekends', 'Working in the same office', 'Traveling internationally every month',
  1,
  'Long distance done right.',
  24
),

-- 25  ⚠️ VERIFY correct_index
(
  'Which activity is specifically one Jeff and Ashlyn love doing together?',
  'Kayaking', 'Hammocking in the park', 'Trivia nights at bars', 'Going to concerts every month',
  1,
  NULL,
  25
),

-- 26  ⚠️ VERIFY correct_index
(
  'Which food related activity fits Jeff and Ashlyn best?',
  'Trying new pizza places', 'Ranking sushi restaurants', 'Making homemade pasta every Sunday', 'Hunting for the best tacos in every city',
  3,
  NULL,
  26
),

-- 27  ⚠️ VERIFY correct_index
(
  'Which at home activity fits Jeff and Ashlyn best?',
  'Building furniture together', 'Finding new recipes to make', 'Playing co op video games', 'Gardening on weekends',
  1,
  NULL,
  27
),

-- 28  ⚠️ VERIFY correct_index
(
  'What movie is listed as Jeff and Ashlyn''s favorite movie together?',
  'Interstellar', 'Inception', 'The Prestige', 'La La Land',
  3,
  NULL,
  28
),

-- 29  ⚠️ VERIFY correct_index
(
  'Who said "I love you" first in Jeff and Ashlyn''s relationship?',
  'Jeff', 'Ashlyn', 'They said it together', 'Neither remembers',
  0,
  NULL,
  29
),

-- 30  ⚠️ VERIFY correct_index
(
  'Who is considered the better cook in Jeff and Ashlyn''s relationship?',
  'Jeff', 'Ashlyn', 'It is a tie', 'Depends on whether it is breakfast or dinner',
  1,
  NULL,
  30
),

-- 31  ⚠️ VERIFY correct_index
(
  'Who usually takes longer to get ready in Jeff and Ashlyn''s relationship?',
  'Jeff', 'Ashlyn', 'Whoever is driving', 'They are basically the same',
  1,
  NULL,
  31
),

-- 32  ⚠️ VERIFY correct_index
(
  'Which phrase has real significance in Jeff and Ashlyn''s relationship?',
  'Full send', 'Put your thing down', 'Stay golden', 'No free rides',
  1,
  NULL,
  32
),

-- 33  ⚠️ VERIFY correct_index
(
  'What love language detail especially matters in Jeff and Ashlyn''s relationship?',
  'Jeff especially values gifts', 'Ashlyn especially values words of affirmation', 'They both mostly care about acts of service only', 'They do not really think in terms of love languages',
  1,
  NULL,
  33
),

-- 34
(
  'Which quality is most true of how Jeff tries to love Ashlyn in their relationship?',
  'He is very sarcastic and hands off', 'He is intentional about showing love', 'He keeps things spontaneous but unspoken', 'He mostly avoids words and lets actions do everything',
  1,
  'The 4.5-hour drive says it all.',
  34
),

-- 35  ⚠️ VERIFY correct_index
(
  'What kind of stories and entertainment does Jeff tend to love most?',
  'Historical romance and musicals', 'Character driven sci fi and psychological thrillers', 'Sports documentaries only', 'Reality dating shows',
  1,
  NULL,
  35
),

-- 36  ⚠️ VERIFY correct_index
(
  'Which author fits Jeff''s reading taste the best?',
  'Brandon Sanderson', 'Emily Henry', 'Nicholas Sparks', 'John Grisham',
  0,
  NULL,
  36
),

-- 37  ⚠️ VERIFY correct_index
(
  'Which of these books is one Jeff has especially enjoyed?',
  'Project Hail Mary', 'Normal People', 'The Seven Husbands of Evelyn Hugo', 'It Ends With Us',
  0,
  NULL,
  37
),

-- 38
(
  'Which drink choice is the most Jeff coded?',
  'Tequila soda', 'Bourbon', 'Gin and tonic', 'Espresso martini',
  1,
  'A man of taste.',
  38
),

-- 39  ⚠️ VERIFY correct_index
(
  'Which bourbon is one Jeff especially likes?',
  'Four Roses Small Batch Select', 'Fireball', 'Jameson Orange', 'Crown Royal Apple',
  0,
  NULL,
  39
),

-- 40  ⚠️ VERIFY correct_index
(
  'Which creative field best describes Jeff?',
  'Accounting and finance', 'Design, branding, and visual work', 'Real estate and house flipping', 'Public speaking and debate',
  1,
  NULL,
  40
),

-- 41  ⚠️ VERIFY correct_index
(
  'What kind of projects does Jeff naturally get excited about most?',
  'Screen printing and creative branding work', 'Fantasy baseball spreadsheets', 'Car restoration', 'Landscape architecture',
  0,
  NULL,
  41
),

-- 42
(
  'On the day Jeff proposed, what did Ashlyn think the plan for the day was?',
  'A family dinner', 'A fun day for Megan and Izzy to meet', 'A surprise birthday party', 'A wedding venue tour',
  1,
  'She had no idea.',
  42
),

-- 43
(
  'Which two friends were in on Jeff''s proposal surprise plan?',
  'Paige and Shelby', 'Megan and Izzy', 'Emma and Brynn', 'Alondra and Paige',
  1,
  'Good friends keep good secrets.',
  43
),

-- 44
(
  'Where did Jeff propose to Ashlyn?',
  'Davis & Grey Farms', 'Arbor Hills', 'Galveston Bay Brewing', 'Texas A&M Commerce',
  1,
  'Arbor Hills Nature Preserve — one knee, ring in hand.',
  44
),

-- 45  ⚠️ VERIFY correct_index
(
  'What detail made Jeff''s proposal setup especially specific and memorable?',
  'Jeff was waiting at the end of a different path in the trees', 'Jeff proposed in the middle of a crowded restaurant', 'Jeff proposed on a boat at sunset', 'Jeff proposed during a football game timeout',
  0,
  NULL,
  45
),

-- 46  ⚠️ VERIFY correct_index
(
  'What was Ashlyn''s actual response when Jeff proposed?',
  '"Of course I will"', '"Yes, yes, yes, yes I will!"', '"Finally!"', '"I knew this was happening"',
  1,
  NULL,
  46
),

-- 47  ⚠️ VERIFY correct_index
(
  'Where did Jeff and Ashlyn go for dinner after Jeff proposed?',
  'Sonic', '60 Vines', 'Chili''s', 'Pie Tap',
  1,
  NULL,
  47
),

-- 48  ⚠️ VERIFY correct_index
(
  'Where was the big surprise party held after Jeff proposed to Ashlyn?',
  'At Ashlyn''s parents'' house', 'At Jeff''s apartment', 'At Jeff''s parents'' house', 'In a private room at the restaurant',
  2,
  NULL,
  48
),

-- 49
(
  'Which detail makes Jeff and Ashlyn''s random reunion feel especially wild?',
  'They had a class together the next week', 'They were among about 100,000 people and still ended up sitting near each other', 'They got reintroduced by the same friend', 'They were both at the same airport gate',
  1,
  '100,000 people. Five rows apart. The odds.',
  49
),

-- 50
(
  'Which combination feels the most like Jeff and Ashlyn specifically?',
  'Movies, pizza, long talks, and making the most of weekends together', 'Golf, lake trips, and country concerts', 'Clubs, rooftop bars, and last minute road trips', 'Marathon training and meal prep Sundays',
  0,
  'Simple, intentional, and them.',
  50
);
