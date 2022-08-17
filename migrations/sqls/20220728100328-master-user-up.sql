/* Replace with your SQL commands */
CREATE EXTENSION "uuid-ossp";
CREATE TABLE masteruser(
    id uuid not null DEFAULT uuid_generate_v4(),
    username VARCHAR(50) not null,
    password VARCHAR(50) not null,
    firstName VARCHAR(50) not null,
    lastName VARCHAR(50) not null,
    PRIMARY KEY (id)
)