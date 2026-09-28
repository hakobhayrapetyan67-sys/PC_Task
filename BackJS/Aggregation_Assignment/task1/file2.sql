INSERT INTO authors (name, bio) VALUES
('Maria Chen', 'Writes about frontend performance'),
('David Okafor', 'Backend and databases'),
('Sana Malik', 'DevOps and infrastructure'),
('Tom Reyes', 'Career advice for developers');

INSERT INTO articles (title, author_id, published_on, views) VALUES
('Speeding Up Your CSS', 1, '2026-01-05', 820),
('Lazy Loading Images', 1, '2026-01-20', 410),
('Indexing 101', 2, '2026-01-10', 1500),
('Understanding Joins', 2, '2026-02-01', 2100),
('Zero-Downtime Deploys', 3, '2026-01-15', 690),
('Docker for Beginners', 3, '2026-02-05', 950),
('Writing a Great Resume', 4, '2026-01-25', 300),
('Acing the Interview', 4, '2026-02-10', 0);

INSERT INTO comments (article_id, commenter_name) VALUES
(1, 'Alex'),
(1, 'Priya'),
(3, 'Jordan'),
(3, 'Sam'),
(3, 'Lee'),
(4, 'Alex'),
(4, 'Priya'),
(4, 'Jordan'),
(4, 'Sam'),
(5, 'Lee'),
(6, 'Alex'),
(7, 'Priya');