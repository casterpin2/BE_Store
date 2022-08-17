import express, { Request, Response } from 'express';
import { Auth } from '../../jwt/auth';
import dotenv from 'dotenv';
import { PagingModel } from '../../constant/response.constant';
import { ProductModel } from '../entities/product.model';
import { ProductService } from '../service/product.service';
import { ResponseHandel } from '../../handel/handel';
export class ProductController {
  ProductControllerRoutes(app: express.Application) {
    const service = new ProductService();
    const auth = new Auth();
    app.post('/product/create', auth.authMiddleware, async (req, res: Response) => {
      const requestBody = {
        name: req.body.name as string,
        price: req.body.price as number,
      } as ProductModel;

      const response = await this.create(service, requestBody);
      ResponseHandel.modifyResponse(response, res);
    });
    app.post('/product/show', async (req, res: Response) => {
      const requestBody = {
        pageNo: req.body.pageNo as number,
        pageSize: req.body.pageSize as number,
        searchName: (req.body.searchName as string) ? (req.body.searchName as string) : '',
      } as PagingModel;

      const response = await this.getAll(service, requestBody);

      ResponseHandel.modifyResponse(response, res);
    });
    app.get('/product/index/:id', async (req, res: Response) => {
      const response = await this.getDetail(service, req.params.id);
      ResponseHandel.modifyResponse(response, res);
    });
  }
  create(service: ProductService, product: ProductModel) {
    return service.create(product);
  }
  update(service: ProductService, product: ProductModel) {
    return service.update(product);
  }
  getAll(service: ProductService, model: PagingModel) {
    return service.getAll(model);
  }
  getDetail(service: ProductService, id: string) {
    return service.getDetail(id);
  }
}
