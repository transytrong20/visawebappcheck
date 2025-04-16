-- Drop all existing tables
DROP TABLE IF EXISTS visa_images;
DROP TABLE IF EXISTS visa_holders;
DROP TABLE IF EXISTS visas;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS users;

-- Create visa_holders table
CREATE TABLE visa_holders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nationality TEXT NOT NULL,
    full_name TEXT NOT NULL,
    passport_number TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nationality, passport_number)
);

-- Create visa_images table
CREATE TABLE visa_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visa_holder_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visa_holder_id) REFERENCES visa_holders(id)
); 