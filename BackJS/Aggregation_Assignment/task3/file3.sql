SELECT b.title, w.name AS writer_name, b.price
FROM books b
INNER JOIN writers w ON b.writer_id = w.writer_id;

SELECT b.title, r.rating
FROM books b
LEFT JOIN reviews r ON b.book_id = r.book_id;

INSERT INTO writers (name, country) VALUES ('Temp Writer', 'Nowhere');

SELECT w.name AS writer_name, COUNT(b.book_id) AS book_count
FROM writers w
LEFT JOIN books b ON w.writer_id = b.writer_id
GROUP BY w.writer_id, w.name;

DELETE FROM writers WHERE name = 'Temp Writer';