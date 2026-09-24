SELECT title FROM books WHERE tags @> ARRAY['fiction'];

CREATE INDEX idx_books_tags_gin ON books USING GIN (tags);

EXPLAIN ANALYZE SELECT title FROM books WHERE tags @> ARRAY['fiction'];