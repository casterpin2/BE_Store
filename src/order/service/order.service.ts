import dotenv from 'dotenv';
import connection from '../../database';
import { ResponseViewModel } from '../../constant/response.constant';
import { OrderModel, OrderViewModel, ProductOrder } from '../entities/order.model';
import { ProductModel } from '../../product/entities/product.model';
import { PoolClient } from 'pg';

export class OrderService {
  public async connection() {
    dotenv.config();
    const conn = await connection.connect();
    return conn;
  }
  public async create(order: OrderModel): Promise<ResponseViewModel> {
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
      try{
        (await connect).query('BEGIN');
        const sql = `INSERT INTO order_store(
                   user_id, status) VALUES($1, $2) RETURNING *`;
        const resultOrder = (await connect).query(sql, [order.user_id,1]);
        const orderResponse = (await resultOrder).rows[0] as OrderModel;
        const sqlProductOrder = `INSERT INTO product_order(
          product_id, order_id, quantity)
          VALUES ( $1, $2,$3) RETURNING *`;
  
        const resultProductOrder = await (await connect).query(sqlProductOrder, [order.product_id,orderResponse.id,order.quantity]);
        const orderOrderProduct = (await resultProductOrder).rows[0] as ProductOrder;
   
        if(!orderOrderProduct){
          throw Error();
        }
        (await connect).query('COMMIT');
        (await connect).release();
  
        return { data: {}, status: 200, message: 'successfully' };
      }catch(error){
        (await connect).query('ROLLBACK');
        throw new Error(`Create Order failed. Error: `+error);
      }
    }
  }
  public async updateQuantity(
    connect: Promise<PoolClient>,
    quantity: number,
    userId: string,
    productId: string
  ) {
    try{
    
      const order = await this.orderOfUser(connect, userId, productId);

      if (order) {
        (await connect).query('BEGIN');
        const sql = `UPDATE product_order
              SET  quantity=($1)
              WHERE id=($2) RETURNING *`;
        const result = (await connect).query(sql, [order.quantity + quantity,order.id]);
        const orderResponse = (await result).rows[0] as OrderModel;
        if (orderResponse) {
          return true;
        }
        (await connect).query('COMMIT');
      }
    }catch(error){
   
      (await connect).query('ROLLBACK');
      throw new Error(`Update quantity Order failed. Error: `+error);
      
    }
    

   
  }
  public async orderOfUser(connect: Promise<PoolClient>, userId: string, productId: string) {
    const sql = `select po.id ,os.id as OrderId,p.id as ProductId,p.name as ProductName,po.quantity as Quantity,os.status as Status from product_order po 
    join product p on p.id = po.product_id 
    join order_store os on os.id = po.order_id where os.user_id =($1) and po.product_id =($2)`;
    const result = (await connect).query(sql, [userId, productId]);
    const orderResponse = (await result).rows[0] as OrderViewModel;
    return orderResponse;
  }

  public async getOrderOfUser(userId: string): Promise<ResponseViewModel> {
    try {
      if (!userId) {
        return { data: [], status: 500, message: 'Internal Server' };
      }
      const connect = this.connection();
      const sql = `select os.id as OrderId,p.id as ProductId,p.name as ProductName,po.quantity as Quantity,os.status as Status from product_order po 
      join product p on p.id = po.product_id 
      join order_store os on os.id = po.order_id where os.user_id =($1)`;
      const result = (await connect).query(sql, [userId]);
      const orderResponse = (await result).rows as OrderViewModel[];

      (await connect).release();
      orderResponse.forEach((item) => {
        switch (item.status) {
          case 1:
            item.statusName = 'Active';
            break;
          case 2:
            item.statusName = 'Completed';
            break;
        }
      });
      return { data: orderResponse, status: 200, message: 'successfully' };
    } catch (ex: any) {
      throw new Error(`Get Order detail failed. Error: `+ex);
    }
  }
}
