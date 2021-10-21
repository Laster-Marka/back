import { NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service'

export class TokenMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const cookie = req.cookies['jwt']
      const data = await this.userService.verifyToken(cookie)
      if (!data) {
        throw new UnauthorizedException()
      }
      res.locals.userName = data['name']
    } catch (e) {
      throw new UnauthorizedException()
    }
    next()
  }
}
