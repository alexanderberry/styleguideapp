CREATE DATABASE styleguide;

CREATE TABLE entries(
    entries_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    entries_text TEXT
);