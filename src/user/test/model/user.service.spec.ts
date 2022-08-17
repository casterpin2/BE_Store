import { Auth } from '../../../jwt/auth';
import { UserModel } from '../../entities/user.model';
import { UserService } from '../../service/user.service';

const userService = new UserService();
const auth = new Auth();
describe('User Service Test', () => {
  const user = {
    username: 'casterpin3',
    password: '12345678',
    firstName: 'Test',
    lastName: 'User 003',
  } as UserModel;

  it('return token', async () => {
    const result = await userService.createUser(user);
    expect(result.status).toEqual(200);
  });

  it('login susscess', async () => {
    const result = await userService.login(user);
    expect(typeof result.data == 'string').toBeTrue();
  });
});
