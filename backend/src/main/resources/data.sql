-- Simple data.sql for H2
-- No DELETE/TRUNCATE needed because we use ddl-auto=create

-- Insert a sample user (password is 'password123' encrypted with BCrypt)
-- This allows you to log in as admin@hiddenly.com / password123 to add your own spots.
INSERT INTO users (id, name, email, password, created_at) 
VALUES (1, 'Admin Explorer', 'admin@hiddenly.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00dmpx8IzV3.i.', NOW());

-- Existing spots have been removed to give you a clean slate.
-- You can now log in and add your own hidden gems!
