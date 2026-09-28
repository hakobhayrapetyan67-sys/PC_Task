SELECT
    b.title,
    ROUND(AVG(r.rating), 2) AS average_rating,
    COUNT(r.review_id) AS total_reviews
FROM books b
LEFT JOIN reviews r ON b.book_id = r.book_id
GROUP BY b.book_id, b.title;

SELECT 
    b.title,
    ROUND(AVG(r.rating), 2) AS average_rating
FROM books b
JOIN reviews r ON b.book_id = r.book_id
GROUP BY b.book_id, b.title
HAVING AVG(r.rating) > 4.0;

SELECT 
    w.name AS writer_name,
    COUNT(b.book_id) AS books_count,
    ROUND(AVG(b.price), 2) AS average_price
FROM writers w
LEFT JOIN books b ON w.writer_id = b.writer_id
GROUP BY w.writer_id, w.name