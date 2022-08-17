import supertest from 'supertest';
import app from '../../../app';
import { PagingModel } from '../../../constant/response.constant';
import { ProductModel } from '../../../product/entities/product.model';
import { UserModel } from '../../../user/entities/user.model';
import { OrderModel } from '../../entities/order.model';

const request = supertest(app);
describe('Order Api', () => {
  const user = {
    username: 'casterpin',
    password: '12345678',
    firstName: 'Test',
    lastName: 'User 001',
  } as UserModel;
  const requestBody = { name: 'Test End Point Order', price: 100 } as ProductModel;
  const pageModel = {
    pageNo: 1,
    pageSize: 20,
  } as PagingModel;
  it('create order api endpoint', async () => {
    //create user
    await request.post('/user/create').set('Accept', 'application/json').send(user);
    //login user
    const loginUser = await request
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(user);
   
    const token = loginUser.body.data as string;
    //create product
    await request.post('/product/create').set('Authorization', `Bearer ${token}`).send(requestBody);
    //get Product
    pageModel.searchName = requestBody.name;
    const productAll = await request.post('/product/show').send(pageModel);
    const orderModel = {
      quantity: 100,
      product_id: productAll.body.data.items[0].id as string,
    } as OrderModel;
    const res = await request
      .post('/order/create')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(orderModel);
    expect(res.status).toEqual(200);
  });
  it('get order of user api endpoint', async () => {
    //login user
    const loginUser = await request
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(user);
    const token = loginUser.body.data as string;
    // get order of user
    const res = await request.get('/order/detail').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
