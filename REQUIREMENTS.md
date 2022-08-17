# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `product/index/:id`
- Show `product/show`
- Create [token required] `product/create` (token)


#### Users
- Index [token required] `user/index` (token)
- Show [token required] `user/show` (token)
- [MODIFIED]Create N[token required] =>  (non-token) `user/create`
- [ADDED] Login User `user/login`
#### Orders
- Current Order by user (args: user id)[token required]  `order/detail` (token)
- [ADDED] Create Order [token required] `order/create` (token)

## Data Shapes
#### Product
-  id
- name
- price
Table: `Product (id:uuid_generate_v4[primary key], name:text[not null], price:numeric[not null])`
#### User
- id
- firstName
- lastName
- password
- [ADDED]  username,
Table: `masteruser (id:uuid_generate_v4[primary key], username:text[not null], password:text[not null]),firstName:text,lastName:text`
#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
Table: `order_store (id:uuid_generate_v4[primary key], product_id:uuid[not null], user_id:uuid[not null]),quantity:integer,status:integer`
status: 1 - active,2-complete

