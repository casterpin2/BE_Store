import supertest from 'supertest';
import app from '../../../app';
import { PagingModel } from '../../../constant/response.constant';
import { UserModel } from '../../../user/entities/user.model';
import { ProductModel } from '../../entities/product.model';

const request = supertest(app);
describe('Product Api', () => {
  const user = {
    username: 'casterpin5',
    password: '12345678',
    firstName: 'Test',
    lastName: 'User 005',
  } as UserModel;
  const requestBody = { name: 'Test End Point Product Api', price: 100 } as ProductModel;
  const pageModel = {
    pageNo: 1,
    pageSize: 20,
  } as PagingModel;
  it('create product api endpoint', async () => {
    //create user
    await request.post('/user/create').set('Accept', 'application/json').send(user);
    //login user
    const loginUser = await request
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(user);
    const token = loginUser.body.data as string;
    //create product
    const res = await request
      .post('/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send(requestBody);
    expect(res.body.data.name).toEqual(requestBody.name);
  });
  it('get all product api endpoint', async () => {
    const res = await request.post('/product/show').send(pageModel);
    expect(res.status).toEqual(200);
  });
  it('get detail product api endpoint', async () => {
    pageModel.searchName = requestBody.name;
    const productAll = await request.post('/product/show').send(pageModel);

    const res = await request.get(`/product/index/${productAll.body.data.items[0].id}`);

    expect(res.body.data.name).toEqual(requestBody.name);
  });
});
