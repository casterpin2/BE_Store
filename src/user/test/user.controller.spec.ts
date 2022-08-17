import supertest from 'supertest';
import app from '../../app';
import { PagingModel } from '../../constant/response.constant';
import { UserModel } from '../entities/user.model';
import { UserService } from '../service/user.service';

const request = supertest(app);
describe('User Api', () => {
  const user = {
    username: 'casterpin4',
    password: '12345678',
    firstName: 'Test',
    lastName: 'User 002',
  } as UserModel;

  it('create user api endpoint', async () => {
    const res = await request.post('/user/create').set('Accept', 'application/json').send(user);
    expect(res.status).toBe(200);
  });

  it('login user api endpoint', async () => {
    const res = await request.post('/user/login').set('Accept', 'application/json').send(user);
    expect(typeof res.body.data === 'string').toBe(true);
  });
  it('show detail user api endpoint', async () => {
    const loginUser = await request
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(user);
    const token = loginUser.body.data as string;
    const res = await request.get('/user/index').set('Authorization', `Bearer ${token}`);

    expect(res.body.data.username as string).toEqual('casterpin4');
  });
  it('get all user api endpoint', async () => {
    const loginUser = await request
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(user);
    const token = loginUser.body.data as string;
    const res = await request
      .get('/user/show')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pageNo: 1,
        pageSize: 20,
      } as PagingModel);

    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.status).toBe(200);
  });
});
