CREATE TABLE IF NOT EXISTS visas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nationality TEXT NOT NULL,
    full_name TEXT NOT NULL,
    passport_number TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nationality, passport_number)
); 