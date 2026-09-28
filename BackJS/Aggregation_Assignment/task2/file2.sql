SELECT ar.title, COUNT(c.comment_id) AS comment_count
FROM articles ar
LEFT JOIN comments c ON ar.article_id = c.article_id
GROUP BY ar.article_id, ar.title;

SELECT ar.title, COUNT(c.comment_id) AS comment_count
FROM articles ar
LEFT JOIN comments c ON ar.article_id = c.article_id
GROUP BY ar.article_id, ar.title
ORDER BY comment_count DESC
LIMIT 1;