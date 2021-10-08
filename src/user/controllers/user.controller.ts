import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Put,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { json, Request, Response } from 'express';
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { EditUserDto } from '../dto/edit-user.dto'
import { EditPasswordDto } from '../dto/edit-password.dto'
import { GetUserDto } from '../dto/get-user.dto'
import { IUser } from '../interfaces/user.interface'
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    //private readonly jwtService: JwtService
  ) {}

  private async getUserFromCookie(cookie): Promise<string> {
    if (!cookie) {
      throw new UnauthorizedException()
    }
    const name: string = await this.userService.verifyToken(cookie)
    if (!name) {
      throw new UnauthorizedException()
    }
    return name
  }

  @Post('signup')
  async signUp(@Res() res: Response, @Body('createUserDto') createUserDto: CreateUserDto): Promise<Response> {
    const user: IUser = await this.userService.signup(createUserDto)
    return res.status(HttpStatus.CREATED).json({ user })
  }

  @Post('login')
  async logIn(@Res({passthrough:true}) res: Response, @Body('getUserDto') getUserDto: GetUserDto) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const user: IUser = await this.userService.getByEmail(getUserDto.email)
    if (user) {
      const isCorrectPassword = await user.comparePassword(getUserDto.password)
      if (isCorrectPassword) {
        const token = await this.userService.getToken(user.name)
        res.status(HttpStatus.ACCEPTED).cookie('jwt', token, {
          sameSite: 'lax',
          path: '/',
          expires: new Date(new Date().getTime() + 100 * 1000),
          httpOnly: true
        })
        return token
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Wrong credentials' })
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Wrong credentials' })
    }
  }

  @Post('logout')
  async logOut(@Res() res: Response) {
    res.clearCookie('jwt')
    return res.status(HttpStatus.OK).json()
  }

  @Get()
  async get(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies.jwt
    if (cookie) {
      try {
        const name: string = await this.getUserFromCookie(cookie)
        res.status(HttpStatus.OK).json({ name })
      } catch (e) {
        throw new UnauthorizedException()
      }
    } else {
      return res.status(HttpStatus.NO_CONTENT).json(req.cookies)
    }
  }

  @Put()
  async edit(@Req() req: Request, @Res() res: Response, @Body('editUserDto') editUserDto: EditUserDto) {
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const user: IUser = await this.userService.edit(name, editUserDto)
    return res.status(HttpStatus.OK).json({ user })
  }

  @Put('/password')
  async editPassword(@Req() req: Request, @Res() res: Response, @Body('editPasswordDto') editPasswordDto: EditPasswordDto) {
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const user: IUser = await this.userService.editPassword(name, editPasswordDto)
    return res.status(HttpStatus.OK).json({ user })
  }

  @Delete()
  async delete(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const response: { ok?: number; n?: number } & { deletedCount?: number; } = await this.userService.delete(name)
    return res.status(HttpStatus.OK).json({ response })
  }
}
