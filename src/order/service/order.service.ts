import dotenv from 'dotenv';
import connection from '../../database';
import { ResponseViewModel } from '../../constant/response.constant';
import { OrderModel } from '../entities/order.model';
import { ProductModel } from '../../product/entities/product.model';
import { PoolClient } from 'pg';

export class OrderService {
  public async connection() {
    dotenv.config();
    const conn = await connection.connect();
    return conn;
  }
  public async create(order: OrderModel): Promise<ResponseViewModel> {
    try {
      const connect = this.connection();
      const updateOrder = await this.updateQuantity(
        connect,
        order.quantity,
        order.user_id,
        order.product_id
      );
      if (updateOrder) {
        return { data: {}, status: 200, message: 'successfully' };
      } else {
        const sql = `INSERT INTO order_store(
                    product_id, user_id, quantity, status) VALUES($1, $2,$3,$4) RETURNING *`;
        await (await connect).query(sql, [order.product_id, order.user_id, order.quantity, 1]);
        await (await connect).release();

        return { data: {}, status: 200, message: 'successfully' };
      }
    } catch (ex: any) {
      console.log(ex);
      return { data: [], status: 500, message: 'Internal Server' };
    }
  }
  public async updateQuantity(
    connect: Promise<PoolClient>,
    quantity: number,
    userId: string,
    productId: string
  ) {
    const order = await this.orderOfUser(connect, userId, productId);

    if (order) {
      const sql = `UPDATE order_store
            SET  quantity=($1)
            WHERE user_id=($2) and product_id=($3) RETURNING *`;
      const result = (await connect).query(sql, [order.quantity + quantity, userId, productId]);
      const orderResponse = (await result).rows[0] as OrderModel;
      if (orderResponse) {
        return true;
      }
    }

    return false;
  }
  public async orderOfUser(connect: Promise<PoolClient>, userId: string, productId: string) {
    const sql = `SELECT id, product_id, user_id, quantity, status
        FROM order_store where user_id=($1) and product_id=($2)`;
    const result = (await connect).query(sql, [userId, productId]);
    const orderResponse = (await result).rows[0] as OrderModel;
    return orderResponse;
  }

  public async getOrderOfUser(userId: string): Promise<ResponseViewModel> {
    try {
      if (!userId) {
        return { data: [], status: 500, message: 'Internal Server' };
      }

      const connect = this.connection();

      const sql = `SELECT id, product_id, user_id, quantity, status
            FROM public.order_store where user_id = ($1)`;
      const result = (await connect).query(sql, [userId]);
      const orderResponse = (await result).rows;

      (await connect).release();
      orderResponse.forEach((item) => {
        switch (item.status) {
          case 1:
            item.status = 'Active';
            break;
          case 2:
            item.status = 'Completed';
            break;
        }
      });
      return { data: orderResponse, status: 200, message: 'successfully' };
    } catch (ex: any) {
      return { data: [], status: 500, message: 'Internal Server' };
    }
  }
}
