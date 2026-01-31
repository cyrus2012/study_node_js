CREATE DATABASE nodeTest;

CREATE TABLE users(  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    create_time DATE,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL
);

INSERT INTO users (create_time, name, password, role_id) VALUES ('2025-2-3', 'Tom', '123456', 1);
INSERT INTO users (create_time, name, password, role_id) VALUES ('2025-2-4', 'Sam', 'abc123', 2);
INSERT INTO users (create_time, name, password, role_id) VALUES ('2025-2-6', 'Cherry', 'qwert', 3);

CREATE TABLE services(
    id int NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO services (id, name) VALUES (101, 'serviceA');
INSERT INTO services (id, name) VALUES (102, 'serviceB');
INSERT INTO services (id, name) VALUES (103, 'serviceC');
INSERT INTO services (id, name) VALUES (104, 'serviceD');

CREATE TABLE role_permission(
    role_id int UNIQUE NOT NULL,
    permitService TEXT NOT NULL
);

INSERT INTO role_permission (role_id, permitService) VALUES (1, '101,102');
INSERT INTO role_permission (role_id, permitService) VALUES (2, '101,103');
INSERT INTO role_permission (role_id, permitService) VALUES (3, '101,102 104');