import connection from '../../database';

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PagingModel, ResponseViewModel } from '../../constant/response.constant';
import { ProductModel } from '../entities/product.model';

export class ProductService {
  public async connection() {
    dotenv.config();
    const conn = await connection.connect();
    return conn;
  }
  public async create(product: ProductModel): Promise<ResponseViewModel> {
    try {
      const connect = this.connection();
      const sql = 'INSERT INTO product(name, price) VALUES($1, $2) RETURNING *';
      (await connect).query(sql, [product.name, product.price]);
      (await connect).release();

      return { data: product, status: 200, message: 'successfully' };
    } catch (ex: any) {
      throw new Error(`Could not create product. Error: `+ex);
    }
  }
  public async update(product: ProductModel): Promise<ResponseViewModel> {
    try {
      const connect = this.connection();
      const sqlFind = `SELECT id, name, price
            FROM public.product where id =($1)`;
      const result = (await connect).query(sqlFind, [product.id]);
      const userDb = (await result).rows[0] as ProductModel;
      if (!userDb) {
        return { data: '', status: 400, message: 'Not Found' };
      }
      const sql = `UPDATE public.product
            SET  name=($1), price=($2)
            WHERE id=($5) RETURNING *`;
      (await connect).query(sql, [product.name, product.price, product.id]);
      (await connect).release();

      return { data: product, status: 200, message: 'successfully' };
    } catch (ex: any) {
      throw new Error(`Could not update product. Error: `+ex);
    }
  }
  public async getAll(model: PagingModel): Promise<ResponseViewModel> {
    try {
      const connect = this.connection();
      let sql = `select id, name, price from product order by name limit ($1) offset ($2)`;
      const page = (model.pageNo - 1) * model.pageSize;
      let arrayParams = [model.pageSize, page] as any[];

      if (model.searchName) {
        sql = `select id, name, price from product where name=($1) order by name limit ($2) offset ($3)`;
        arrayParams = [model.searchName, model.pageSize, page];
      }
      const result = (await connect).query(sql, arrayParams);
      const productDb = (await result).rows as ProductModel[];

      (await connect).release();
      const response = {
        pageNo: model.pageNo,
        pageSize: model.pageSize,
        total: productDb.length,
        items: productDb,
      };
      return { data: response, status: 200, message: 'successfully' };
    } catch (ex: any) {
      throw new Error(`Could not get all product. Error: `+ex);
    }
  }
  public async getDetail(id: string): Promise<ResponseViewModel> {
    try {
      if (!id) {
        return { data: [], status: 404, message: 'Product is not found' };
      }

      const connect = this.connection();
      const sql = `select id, name, price from product where id=($1)`;

      const result = (await connect).query(sql, [id]);
      const productDb = (await result).rows[0] as ProductModel;
      if (!productDb) {
        return { data: [], status: 404, message: 'Not found' };
      }
      (await connect).release();

      return { data: productDb, status: 200, message: 'successfully' };
    } catch (ex: any) {
      throw new Error(`Could not get detail product. Error: `+ex);
    }
  }
}
