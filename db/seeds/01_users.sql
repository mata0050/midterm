-- Users table seeds here (Example)
insert into users (id, name, phone_number, password) values (1, 'Fay McDonand', '596-590-7019', 'KDueoEvrkcyA');
insert into users (id, name, phone_number, password) values (2, 'Thaddeus Ligerton', '307-417-1997', 'DbmVU9J6');
insert into users (id, name, phone_number, password) values (3, 'Maud Thorington', '216-578-3777', '7X0NKa7U');
insert into users (id, name, phone_number, password) values (4, 'Sibyl Filippov', '871-462-1638', '7XZd26JOlkxK');
insert into users (id, name, phone_number, password) values (5, 'Lesly Crommett', '755-638-9081', 'FiDyVmUU');


-- food table data
insert into food (id, name, price, photo_url) values (1, 'Tea - Decaf 1 Cup', 2713, 'http://dummyimage.com/225x100.png/ff4444/ffffff');
insert into food (id, name, price, photo_url) values (2, 'Sobe - Cranberry Grapefruit', 1836, 'http://dummyimage.com/110x100.png/dddddd/000000');
insert into food (id, name, price, photo_url) values (3, 'Soup - Knorr, Chicken Noodle', 4774, 'http://dummyimage.com/241x100.png/ff4444/ffffff');
insert into food (id, name, price, photo_url) values (4, 'Canadian Emmenthal', 5381, 'http://dummyimage.com/241x100.png/cc0000/ffffff');
insert into food (id, name, price, photo_url) values (5, 'Wine - Red, Concha Y Toro', 9031, 'http://dummyimage.com/244x100.png/cc0000/ffffff');
insert into food (id, name, price, photo_url) values (6, 'Cod - Fillets', 9038, 'http://dummyimage.com/129x100.png/ff4444/ffffff');
insert into food (id, name, price, photo_url) values (7, 'Beef - Tenderloin - Aa', 7557, 'http://dummyimage.com/208x100.png/dddddd/000000');


-- order table
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (1, 32, 5245, '11/1/2021', false, 3, 6);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (2, 56, 1998, '10/19/2021', true, 2, 6);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (3, 85, 9881, '10/30/2021', false, 2, 3);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (4, 30, 2250, '10/30/2021', false, 3, 4);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (5, 87, 5935, '10/20/2021', true, 1, 6);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (6, 49, 3966, '5/17/2021', false, 4, 6);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (7, 71, 1521, '10/7/2021', false, 3, 4);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (8, 97, 2523, '8/19/2021', false, 3, 2);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (9, 18, 2993, '1/13/2021', false, 2, 6);
insert into orders (id, order_number, how_long, started_at, is_completed, user_id, food_id) values (10, 58, 1110, '2/3/2021', true, 4, 7);
