CREATE TABLE writers (
    writer_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    writer_id INTEGER REFERENCES writers(writer_id),
    published_year INTEGER,
    price NUMERIC(6,2) NOT NULL CHECK (price > 0)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT
);