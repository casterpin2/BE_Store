/* Replace with your SQL commands */
CREATE TABLE product
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price integer NOT NULL,
    PRIMARY KEY (id)
);