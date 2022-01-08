-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);


-- Drop and recreate food table (Example)

DROP TABLE IF EXISTS food CASCADE;
CREATE TABLE food (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  photo_url VARCHAR(255) NOT NULL

);


-- Drop and recreate orders table (Example)

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  order_number VARCHAR(255) NOT NULL,
  how_long INTEGER NOT NULL,
  started_at TIMESTAMP NOT NULL,
  is_completed BOOLEAN,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  food_id INTEGER REFERENCES food (id) ON DELETE CASCADE
);
