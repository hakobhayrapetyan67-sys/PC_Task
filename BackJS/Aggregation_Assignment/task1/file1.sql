CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER REFERENCES authors(author_id),
    published_on DATE NOT NULL,
    views INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(article_id),
    commenter_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 