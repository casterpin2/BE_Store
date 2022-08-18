import express, { Request, Response } from 'express';

import { Auth } from '../../jwt/auth';
import dotenv from 'dotenv';
import { PagingModel } from '../../constant/response.constant';
import { OrderService } from '../service/order.service';
import { OrderModel } from '../entities/order.model';
import { JwtPayload } from 'jsonwebtoken';
import { ResponseHandel } from '../../handel/handel';

export class OrderController {
  OrderControllerRoutes(app: express.Application) {
    const service = new OrderService();
    const auth = new Auth();
    app.post('/order/create', auth.authMiddleware, async (req, res: Response) => {
    
      const requestBody = {
        quantity: req.body.quantity as number,
        product_id: req.body.productId as string,
      } as OrderModel;

      requestBody.user_id = req.params.userId;

      const response = await service.create(requestBody);
      ResponseHandel.modifyResponse(response, res);
    });

    app.get('/order/detail', auth.authMiddleware, async (req, res: Response) => {
      const response = await service.getOrderOfUser(req.params.userId);
      ResponseHandel.modifyResponse(response, res);
    });
  }
}
