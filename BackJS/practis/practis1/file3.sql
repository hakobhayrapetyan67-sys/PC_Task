DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products(
    product_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name text NOT NULL,
    price NUMERIC(8, 2) not null CHECK(price > 0),
    category_id INTEGER,  
    stock_quantity integer NOT NULL DEFAULT 0
);

CREATE TABLE orders(
    order_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id integer,
    quantity integer NOT NULL CHECK (quantity > 0),
    order_date date NOT NULL DEFAULT CURRENT_DATE
);

INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES 
('Wireless Mouse', 19.99, 1, 150),
('Mechanical Keyboard', 49.99, 1, 80),
('Standing Desk', 249.00, 2, 30),
('Office Chair', 129.50, 2, 45),
('Notebook Pack', 4.99, 3, 300),
('Gel Pens (12-pack)', 6.50, 3, 220),
('PostgreSQL Handbook', 39.00, 4, 60),
('SQL Cookbook', 34.00, 4, 40),
('Building Blocks', 24.99, 5, 60),
('Desk Lamp', 15.50, NULL, 0);

INSERT INTO orders (product_id, quantity, order_date) VALUES 
((SELECT product_id FROM products WHERE product_name = 'Wireless Mouse'), 2, '2026-01-05'),
((SELECT product_id FROM products WHERE product_name = 'Wireless Mouse'), 1, '2026-01-12'),
((SELECT product_id FROM products WHERE product_name = 'Mechanical Keyboard'), 1, '2026-01-12'),
((SELECT product_id FROM products WHERE product_name = 'Standing Desk'), 1, '2026-01-20'),
((SELECT product_id FROM products WHERE product_name = 'Office Chair'), 2, '2026-01-22'),
((SELECT product_id FROM products WHERE product_name = 'Notebook Pack'), 5, '2026-02-01'),
((SELECT product_id FROM products WHERE product_name = 'Gel Pens (12-pack)'), 3, '2026-02-01'),
((SELECT product_id FROM products WHERE product_name = 'PostgreSQL Handbook'), 1, '2026-02-10'),
((SELECT product_id FROM products WHERE product_name = 'Wireless Mouse'), 3, '2026-02-15'),
((SELECT product_id FROM products WHERE product_name = 'Gel Pens (12-pack)'), 2, '2026-02-18');


--INNER JOIN
--LEFT JOIN 
--RIGHT JOIN
--FULL OUTER JOIN / FULL JOIN


--karevora noric nai