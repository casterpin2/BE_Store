/* Replace with your SQL commands */
CREATE TABLE product
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    price integer NOT NULL,
    PRIMARY KEY (id)
);