import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user/services/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get('home')
  async data(@Res() res: Response, @Req() req) {
    const cookie = req.cookies['jwt']
    const name = await this.userService.verifyToken(cookie)
    const folders = await this.userService.getFoldersByUser(name)
    return res.status(HttpStatus.OK).json({ folders })
  }
}