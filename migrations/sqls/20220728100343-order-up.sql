
CREATE TABLE order_store
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    product_id uuid,
    user_id uuid,
    quantity integer,
    status integer,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_order FOREIGN KEY (product_id)
        REFERENCES public.product (id),
        CONSTRAINT fk_user_order FOREIGN KEY (user_id)
        REFERENCES public.masteruser (id)
        
);