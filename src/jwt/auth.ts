import { Request, Response, NextFunction } from 'express';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { PayLoadModel } from '../models/payload.model';

export class Auth {
  public authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const accessTokenFromHeader = req.headers.authorization;
      if (!accessTokenFromHeader) {
        throw new Error();
      }
      const token = accessTokenFromHeader?.split(' ')[1];
     
      const verified = verify(token, process.env.ACCESS_TOKEN_SECRET as string);
      if (!verified) {
        throw new Error();
      }
      const jwtPayload = verified as JwtPayload;
      req.params.userId = jwtPayload.payload.userId as string;
      next();
    } catch (ex) {
      console.log(ex);
      res.status(401).send('Access Denied');
    }
  }

  public async generateToken(payload: PayLoadModel, secretSignature: string, tokenLife: string) {
    try {
      return await sign({ payload }, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
    } catch (error) {
      return null;
    }
  }
}
