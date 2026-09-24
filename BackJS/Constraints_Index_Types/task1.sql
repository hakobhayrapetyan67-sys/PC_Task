DROP TABLE IF EXISTS authors CASCADE;

CREATE TABLE authors (
    author_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    country varchar(50) DEFAULT 'Unknown',
    joined_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO authors(full_name, email, country) VALUES
('Hovhannes Tumnayan', 'tumanyan@mail.com', 'Armenia');

INSERT INTO authors(full_name, email) VALUES
('Avetik Isahakyan', 'isahakyan@gmail.com');

INSERT INTO authors (full_name, email, country) VALUES
('Yeghishe CHrents', 'chaents@mail.com', 'Armenia');

SELECT * FROM authors