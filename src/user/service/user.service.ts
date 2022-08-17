import connection from '../../database';
import { UserModel } from '../entities/user.model';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PagingModel, ResponseViewModel } from '../../constant/response.constant';
import { Auth } from '../../jwt/auth';

export class UserService {
  public async connection() {
    const conn = await connection.connect();
    return conn;
  }

  public async login(user: UserModel): Promise<ResponseViewModel> {
    try {
      dotenv.config();
      const objectEmpty = this.validatorUser(user);
      if (objectEmpty) {
        return objectEmpty;
      }
      const connect = this.connection();
      const sql = 'select * from masteruser where username=($1)';
      const result = (await connect).query(sql, [user.username]);
      const userDb = (await result).rows[0] as UserModel;
      (await connect).release();

      if (!userDb) {
        return { data: null, status: 400, message: 'Username or Password not correct' };
      }
      const match = bcrypt.compareSync(user.password + `s04$$w0rD`, userDb.password);

      if (match) {
        const auth = new Auth();
        const accessToken = await auth.generateToken(
          { userId: userDb.id },
          process.env.ACCESS_TOKEN_SECRET as string,
          process.env.ACCESS_TOKEN_LIFE as string
        );

        return { data: accessToken, status: 200, message: 'successfully' };
      } else {
        return { data: null, status: 400, message: 'Username or Password not correct' };
      }
    } catch (ex) {
      return { data: null, status: 500, message: 'Internal Server' };
    }
  }
  public async createUser(user: UserModel): Promise<ResponseViewModel> {
    try {
      dotenv.config();

      const objectEmpty = this.validatorUser(user);
      if (objectEmpty) {
        return objectEmpty;
      }

      const connect = this.connection();
      const sql =
        'INSERT INTO masteruser(username, password, firstname,lastname) VALUES($1, $2, $3,$4) RETURNING *';
      const hash = bcrypt.hashSync(user.password + 's04$$w0rD', 10);

      (await connect).query(sql, [user.username, hash, user.firstName, user.lastName]);
      (await connect).release();
    
      return { data: {}, status: 200, message: 'successfully' };
    } catch (ex: any) {
      console.log(ex);
      return { data: [], status: 500, message: 'Internal Server' };
    }
  }

  public validatorUser(user: UserModel) {
    
    if (!user.username) {
      return { data: {}, status: 400, message: 'Username is empty' };
    }
    if (!user.password) {
      return { data: {}, status: 400, message: 'Password is empty' };
    }
    return null;
  }
  public async getUser(id: string): Promise<ResponseViewModel> {
    try {
      dotenv.config();

      const connect = this.connection();
      const sql = 'select * from masteruser where id=($1)';

      const result = (await connect).query(sql, [id]);
      const userDb = (await result).rows[0] as UserModel;

      (await connect).release();

      return { data: userDb, status: 200, message: 'successfully' };
    } catch (ex: any) {
      return { data: [], status: 500, message: 'Internal Server' };
    }
  }
  public async getAll(model: PagingModel): Promise<ResponseViewModel> {
    try {
      dotenv.config();

      const connect = this.connection();
      const sql = `select * from masteruser order by firstName limit ($1) offset ($2)`;
      const page = (model.pageNo - 1) * model.pageSize;
      const result = (await connect).query(sql, [model.pageSize, page]);
      const userDb = (await result).rows as UserModel[];

      (await connect).release();
      const response = {
        pageNo: model.pageNo,
        pageSize: model.pageSize,
        total: userDb.length,
        items: userDb,
      };
      return { data: response, status: 200, message: 'successfully' };
    } catch (ex: any) {
      return { data: [], status: 500, message: 'Internal Server' };
    }
  }
}
