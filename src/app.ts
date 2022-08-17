import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { UserController } from './user/controller/user.controller';
import { ProductController } from './product/controller/product.controller';
import { OrderController } from './order/controller/order.controller';
import dotenv from 'dotenv';
const app = express();
const port = 3000;
//app.enable
// Add routes
app.use(bodyParser.json());
dotenv.config({ path: `.env.${process.env.NODE_ENV || ''} ` });

const userController = new UserController();
userController.UserControllerRoutes(app);
const productController = new ProductController();
productController.ProductControllerRoutes(app);
const orderController = new OrderController();
orderController.OrderControllerRoutes(app);
// Start server
app.listen(port, (): void => {
  console.log(`Projcet run with port ${port}`);
});

export default app;
