INSERT INTO writers(name, country) VALUES
('Elena Vasquez', 'Spain'),
('Kenji Watanabe', 'Japan'),
('Grace Okonkwo', 'Nigeria');

INSERT INTO books(title, writer_id, published_year, price) VALUES
('The Long Horizon', 1, 2019, 18.99),
('Small Fires', 1, 2022, 16.50),
('Paper Lanterns', 2, 2018, 14.00),
('The Quiet Station', 2, 2021, 19.50),
('River of Names', 3, 2020, 15.75),
('Unfinished Maps', 3, 2023, 21.00);

INSERT INTO reviews (book_id, rating) VALUES
(1, 5),
(1, 4),
(1, 5),
(2, 3),
(2, 4),
(3, 5),
(3, 5),
(4, 2),
(4, 3),
(5, 4),
(5, 5),
(5, 4);