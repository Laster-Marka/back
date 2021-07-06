import { Controller, Get, Headers, HttpStatus, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user/services/user.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  //@UseGuards(JwtAuthGuard)
  @Get('home')
  async data(@Res() res: Response, @Req() req) {
    console.log("request: " + req)
    const userName = "patxi"
    const folders = await this.userService.getFoldersByUser(userName)
    return res.status(HttpStatus.OK).json({ folders })
  }
}