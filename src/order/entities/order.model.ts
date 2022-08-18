export class OrderModel {
  id?: string;
  product_id!: string;
  user_id!: string;
  quantity!: number;
  status?: string;
}

export class ProductOrder {
  id!: string;
  product_id!: string;
  order_id!: string;
}

export class OrderViewModel {
  id!:string;
  orderId!: string;
  productId!: string;
  productName!: string;
  quantity!: number;
  status!: number;
  statusName!:string;
}

export class OrderPayLoadModel {
  productId!: string;
  quantity!: number;
}
