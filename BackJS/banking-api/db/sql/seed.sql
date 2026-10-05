INSERT INTO customers (full_name, email, phone)
VALUES 
  ('Hakob Hayrapetyan', 'hakob@example.com', '+37499123456'),
  ('Maria Chen', 'maria@example.com', NULL);

INSERT INTO accounts (customer_id, currency, balance, status)
VALUES 
  (1, 'AMD', 100000, 'active'),
  (1, 'USD', 500, 'active'),
  (2, 'AMD', 200000, 'frozen');