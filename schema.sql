-- Drop existing tables if they exist
DROP TABLE IF EXISTS visa_images;
DROP TABLE IF EXISTS visa_holders;
DROP TABLE IF EXISTS visas;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    type TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create documents table
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    file_key TEXT NOT NULL,
    document_type TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id)
);

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