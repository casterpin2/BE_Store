import { Response } from 'express';
import { ResponseViewModel } from '../constant/response.constant';

export class ResponseHandel {
  public static modifyResponse(response: ResponseViewModel, res: Response) {
    switch (response.status) {
      case 400:
        res.status(400).send(response.message);
        break;
      case 200:
        res.status(200).send(response);
        break;
      case 500:
        res.status(500).send(response.message);
        break;
    }
  }
}
