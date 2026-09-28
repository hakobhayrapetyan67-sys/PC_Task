SELECT title, price
FROM books
WHERE price > (SELECT AVG(price) FROM books);

SELECT name 
FROM writers 
WHERE writer_id IN (
    SELECT writer_id 
    FROM books 
    GROUP BY writer_id 
    HAVING COUNT(book_id) >= 2
);

SELECT b.title, ROUND(AVG(r.rating), 2) AS max_avg_rating
FROM books b
JOIN reviews r ON b.book_id = r.book_id
GROUP BY b.book_id, b.title
ORDER BY max_avg_rating DESC
LIMIT 1;