import express, { Request, Response } from 'express';

import { UserService } from '../service/user.service';
import { Auth } from '../../jwt/auth';
import dotenv from 'dotenv';
import { PagingModel } from '../../constant/response.constant';
import { UserModel } from '../entities/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { ResponseHandel } from '../../handel/handel';
export class UserController {
  UserControllerRoutes(app: express.Application) {
    const service = new UserService();
    const auth = new Auth();
    app.post('/user/create', async (req, res: Response) => {
      const requestBody = {
        username: req.body.username as string,
        password: req.body.password as string,
        firstName: req.body.firstName as string,
        lastName: req.body.lastName as string,
      } as UserModel;
    
      const response = await this.createUser(service, requestBody);
      ResponseHandel.modifyResponse(response, res);
    });
    app.get('/user/index', auth.authMiddleware, async (req, res: Response) => {
      const response = await this.getUser(service, req.params.userId);
      ResponseHandel.modifyResponse(response, res);
    });
    app.post('/user/login', async (req, res: Response) => {
      const response = await this.loginRoute(service, {
        username: req.body.username as string,
        password: req.body.password as string,
      } as UserModel);
      res.send(response);
    });
    app.get('/user/show', auth.authMiddleware, async (req, res) => {
      const requestBody = {
        pageNo: req.body.pageNo as number,
        pageSize: req.body.pageSize as number,
        searchName: '',
      } as PagingModel;
      const response = await this.getAll(service, requestBody);

      ResponseHandel.modifyResponse(response, res);
    });
  }

  loginRoute(service: UserService, user: UserModel) {
    return service.login(user);
  }
  createUser(service: UserService, user: UserModel) {
    return service.createUser(user);
  }
  getUser(service: UserService, id: string) {
    return service.getUser(id);
  }
  getAll(service: UserService, model: PagingModel) {
    return service.getAll(model);
  }
}
