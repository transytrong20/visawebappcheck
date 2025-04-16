-- Create visa_holders table
CREATE TABLE IF NOT EXISTS visa_holders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nationality TEXT NOT NULL,
    full_name TEXT NOT NULL,
    passport_number TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create visa_images table
CREATE TABLE IF NOT EXISTS visa_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visa_holder_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visa_holder_id) REFERENCES visa_holders(id)
); 