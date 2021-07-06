import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class TokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('xxx HELLO, GATO!');
    next();
  }
}