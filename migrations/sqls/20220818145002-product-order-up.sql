CREATE TABLE product_order
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL,
    order_id uuid NOT NULL,
    quantity integer,
    PRIMARY KEY (id),
    CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES product (id),
    CONSTRAINT fk_order FOREIGN KEY (order_id)
        REFERENCES order_store (id)
);