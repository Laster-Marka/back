import { Controller, Get, HttpStatus, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user/services/user.service'

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('home')
  async data(@Res() res: Response, @Req() req) {
    const cookie = req.cookies['jwt']
    if(cookie) {
      const name = await this.userService.verifyToken(cookie)
      const folders = await this.userService.getFoldersByUser(name)
      if(folders === undefined || !folders){
        return res.status(HttpStatus.OK).json()
      }
      return res.status(HttpStatus.OK).json({ folders })
    } else {
      return res.status(HttpStatus.OK).json()
    }
  }
}