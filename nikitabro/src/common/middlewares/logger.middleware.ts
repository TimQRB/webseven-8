import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    console.log(
      `example demonstrating principle of operation of ${req.method}`,
    );
    console.log('Body:', req.body);
    next();
  }
}
