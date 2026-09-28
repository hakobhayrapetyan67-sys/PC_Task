SELECT ar.title, c.commenter_name
FROM articles ar
LEFT JOIN comments c ON ar.article_id = c.article_id;

INSERT INTO authors (name, bio) VALUES ('Temp Author', 'Testing left join');

SELECT au.name AS author_name, ar.title
FROM authors au
LEFT JOIN articles ar ON au.author_id = ar.author_id;

DELETE FROM authors WHERE name = 'Temp Author';