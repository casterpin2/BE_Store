CREATE TABLE order_store
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    status integer,
    PRIMARY KEY (id),
        CONSTRAINT fk_user_order FOREIGN KEY (user_id)
        REFERENCES public.masteruser (id)
        
);