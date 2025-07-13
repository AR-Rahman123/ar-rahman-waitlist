-- Table: users
DROP TABLE IF EXISTS users_backup;
CREATE TABLE users_backup AS SELECT * FROM users;

-- Table: waitlist_responses
DROP TABLE IF EXISTS waitlist_responses_backup;
CREATE TABLE waitlist_responses_backup AS SELECT * FROM waitlist_responses;

-- Data for table: waitlist_responses
INSERT INTO waitlist_responses_backup (id, full_name, email, role, age, prayer_frequency, arabic_understanding, understanding_difficulty, importance, learning_struggle, current_approach, ar_experience, ar_interest, features, likelihood, additional_feedback, interview_willingness, investor_presentation, additional_comments, created_at) VALUES (1, 'Test User Complete', 'test2@example.com', 'Engineer', '25-35', '5_times_daily', 'basic', 'sometimes', 'very_important', 'understanding_arabic', 'translation_apps', 'basic_knowledge', 'very_meaningful', '["live_translation","pronunciation_guidance"]', 'very_likely', 'This sounds amazing!', 'yes_happy_to_help', 'yes_interested', NULL, '2025-07-13T16:18:36.303Z');
INSERT INTO waitlist_responses_backup (id, full_name, email, role, age, prayer_frequency, arabic_understanding, understanding_difficulty, importance, learning_struggle, current_approach, ar_experience, ar_interest, features, likelihood, additional_feedback, interview_willingness, investor_presentation, additional_comments, created_at) VALUES (2, 'Farhad Malik', 'farhad@the-maliks.com', 'CEO', '36-45', '3_4_times_daily', 'basic', 'sometimes', 'very_important', 'lack_resources', 'books_resources', 'some_experience', 'helpful_addition', '["live_translation","pronunciation_guidance","qibla_indicator"]', 'very_likely', 'Test', 'maybe_timing_dependent', 'yes_interested', '', '2025-07-13T16:22:45.812Z');
INSERT INTO waitlist_responses_backup (id, full_name, email, role, age, prayer_frequency, arabic_understanding, understanding_difficulty, importance, learning_struggle, current_approach, ar_experience, ar_interest, features, likelihood, additional_feedback, interview_willingness, investor_presentation, additional_comments, created_at) VALUES (3, 'Ibrahim Malik', 'ibrahim.malik.1492@gmail.com', 'CEO', '36-45', '3_4_times_daily', 'basic', 'often', 'very_important', 'finding_time', 'books_resources', 'some_experience', 'very_meaningful', '["qibla_indicator","pronunciation_guidance","live_translation"]', 'very_likely', 'Test', 'yes_happy_to_help', 'yes_interested', '', '2025-07-13T16:24:07.871Z');

