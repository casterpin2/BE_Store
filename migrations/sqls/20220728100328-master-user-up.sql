/* Replace with your SQL commands */
CREATE EXTENSION "uuid-ossp";
CREATE TABLE masteruser(
    id uuid not null DEFAULT uuid_generate_v4(),
    username text not null,
    password text not null,
    firstName text not null,
    lastName text not null,
    PRIMARY KEY (id)
)