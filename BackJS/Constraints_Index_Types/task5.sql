CREATE EXTENSION IF NOT EXISTS btree_gist;

DROP TABLE IF EXISTS book_signigs CASCADE;

CREATE TABLE book_signings(
    signing_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id integer NOT NULL REFERENCES authors(author_id),
    store_location text NOT NULL,
    during tstzrange NOT NULL  
);

ALTER TABLE book_signings
ADD CONSTRAINT no_overlapping_signings
EXCLUDE USING gist (author_id WITH =, during WITH &&);

INSERT INTO book_signings (author_id, store_locarrion, during) VALUES
(1, 'Bookstore Center', '[2026-03-01 14:00:00+00, 2026-03-01 16:00:00+00)');

INSERT INTO book_signings(author_id, store_location, during) VALUES
(1, 'Bookstore North', '[2026-03-01 15:00:00+00, 2026-03-01 17:00:00+00)');
