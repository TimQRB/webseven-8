import { Request, Response, NextFunction } from 'express';
import { NestMiddleware, Injectable } from '@nestjs/common';

@Injectable()
export class ResponseLoggedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      console.log(
        `Here is a description of the Response,
${req.baseUrl},
${res.statusCode},
the time is ${Date.now() - start}`,
      );
    });

    next();
  }
}

