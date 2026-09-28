SELECT au.name AS author_name, SUM(ar.views) AS total_views
FROM authors au
JOIN articles ar ON au.author_id = ar.author_id
GROUP BY au.name;

SELECT au.name AS author_name, SUM (AR.VIEWS) AS total_views
FROM authors au
JOIN articles ar ON au.author_id = ar.author_id
GROUP BY au.name
HAVING SUM(ar.views) > 1000;