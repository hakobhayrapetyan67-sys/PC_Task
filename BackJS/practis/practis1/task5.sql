SELECT c.category_name, SUM(o.quantity * p.price) AS total_revenue
FROM orders AS o
JOIN products AS p ON o.product_id = p.product_id
JOIN categories AS c ON p.category_id = c.category_id
GROUP BY c.category_name ;
