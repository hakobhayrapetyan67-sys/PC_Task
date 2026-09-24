DROP TABLE IF EXISTS books CASCADE;

CREATE TABLE books(
    book_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id integer NOT NULL REFERENCES authors(author_id),
    title text NOT NULL,
    price numeric(8,2) NOT NULL CHECK(price > 0),
    pages integer CHECK(pages > 0),
    tags text[],
    published_on date NOT NULL
);
INSERT INTO books(author_id, title, price, pages, tegs, published_on) VALUES
(1, 'Anush', 15.50, 120, ARRAY['poetry', 'classic'], '2020-05-15'),
(1, 'The Dog and the Cat', 10.00, 45, ARRAY['poetry', 'fairytale'], '2019-10-10'),
(2, 'The Songs of Freedom', 20.00, 250, ARRAY['poetry', 'history'], '2021-03-20'),
(3, 'The Power of Verse', 18.50, 180, ARRAY['fiction', 'modern'], '2020-08-11'),
(3, 'Path of Fire', 22.00, 310, ARRAY['fiction', 'drama'], '2022-01-05');

INSERT INTO books(author_id, title, price, pages, tags, published_on) VALUES
(1, 'Bad Price Book', -5.00, 100, ARRAY['test'], '2023-01-01');

INSERT INTO books (author_id, title, price, pages, tags, published_on) VALUES 
(9999, 'Ghost Author Book', 12.00, 150, ARRAY['test'], '2023-01-01');

SELECT * FROM books;