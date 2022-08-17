import { PagingModel } from '../../constant/response.constant';
import { Auth } from '../../jwt/auth';
import { ProductService } from '../../product/service/product.service';
import { UserService } from '../../user/service/user.service';
import { OrderModel } from '../entities/order.model';
import { OrderService } from '../service/order.service';

const orderService = new OrderService();
const productService = new ProductService();
const userService = new UserService();
const auth = new Auth();
describe('Order Service Test', () => {
  it('create successfully', async () => {
    const users = await userService.getAll({
      pageNo: 1,
      pageSize: 20,
    } as PagingModel);

    const productData = await productService.getAll({
      pageNo: 1,
      pageSize: 20,
    } as PagingModel);

    const orderModel = {
      quantity: 100,
      product_id: productData.data.items[0].id as string,
      user_id: users.data.items[0].id as string,
    } as OrderModel;

    const result = await orderService.create(orderModel);

    expect(result.status).toEqual(200);
  });
});
