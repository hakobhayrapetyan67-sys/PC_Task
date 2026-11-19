CREATE TABLE categories(
    category_id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL
);

INSERT INTO categories (category_name) VALUES
('Electronics'),
('Furniture'),
('Stationery'),
('Books'),
('Toys');

SELECT * FROM categories
ORDER BY category_is;

UPDATE categories
SET category_name = 'Toys & Games'
WHERE category_name = 'Toys';

INSERT INTO categories (category_name) VALUES ('Temp Category');

SELECT * FROM categories;

DELETE FROM categories
WHERE category_name = 'Temp Ctegory';