DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  status VARCHAR(255) DEFAULT 'active' CONSTRAINT check_types
                      CHECK (element_type IN ('active', 'completed'),
  created_at TIMESTAMP NOT NULL,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE
);
