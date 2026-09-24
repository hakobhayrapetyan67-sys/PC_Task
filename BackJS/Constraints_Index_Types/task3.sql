SELECT * FROM books WHERE published_on BETWEEN '2020-01-01' AND '2020-12-31';

CREATE INDEX index_books_published_on ON books USING btree (published_on);

EXPLAIN ANALYZE SELECT * FROM books WHERE published_on BETWEEN '2020-01-01' AND '2020-12-31';