export class OrderModel {
  id?: string;
  product_id!: string;
  user_id!: string;
  quantity!: number;
  status?: string;
}
