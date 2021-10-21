import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Put,
  Delete,
  Req,
  UnauthorizedException
} from '@nestjs/common'
import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { EditUserDto } from '../dto/edit-user.dto'
import { EditPasswordDto } from '../dto/edit-password.dto'
import { GetUserDto } from '../dto/get-user.dto'
import { IUser } from '../interfaces/user.interface'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async signUp(
    @Res() res: Response,
    @Body('createUserDto') createUserDto: CreateUserDto
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    if (createUserDto) {
      const duplicatedUser: IUser = await this.userService.getByEmail(createUserDto.email)
      if (duplicatedUser) {
        return res
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ message: 'User already exist with this email' })
      }
      const user: IUser = await this.userService.signup(createUserDto)
      return res.status(HttpStatus.CREATED).json({})
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }

  @Post('login')
  async logIn(
    @Res({ passthrough: true }) res: Response,
    @Body('getUserDto') getUserDto: GetUserDto
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const user: IUser = await this.userService.getByEmail(getUserDto.email)
    if (user) {
      const isCorrectPassword = await user.comparePassword(getUserDto.password)
      if (isCorrectPassword) {
        const token = await this.userService.getToken(user.name)
        res.status(HttpStatus.ACCEPTED).cookie('jwt', token, {
          sameSite: 'none',
          secure: true,
          path: '/',
          expires: new Date(new Date().getTime() + 0.1 * 60 * 60 * 1000),
          httpOnly: true
        })
        return token
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'Wrong credentials' })
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Wrong credentials' })
    }
  }

  @Post('logout')
  async logOut(@Res() res: Response) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    res.clearCookie('jwt', {
      sameSite: 'none',
      secure: true,
      path: '/',
      httpOnly: true
    })
    return res.status(HttpStatus.OK).json()
  }

  @Get()
  async get(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies.jwt
    try {
      const name: string = await this.getUserFromCookie(cookie)
      res.status(HttpStatus.OK).json({ name })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  @Put()
  async edit(
    @Req() req: Request,
    @Res() res: Response,
    @Body('editUserDto') editUserDto: EditUserDto
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    if (editUserDto) {
      try {
        await this.userService.edit(name, editUserDto)
        return res.status(HttpStatus.OK).json({})
      } catch (e) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' })
      }
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }

  @Put('/password')
  async editPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body('editPasswordDto') editPasswordDto: EditPasswordDto
  ) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    if (editPasswordDto) {
      try {
        const user: IUser = await this.userService.editPassword(name, editPasswordDto)
        return res.status(HttpStatus.OK).json({ user })
      } catch (e) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' })
      }
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }

  @Delete()
  async delete(@Req() req: Request, @Res() res: Response): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    try {
      const response: { ok?: number; n?: number } & { deletedCount?: number } =
        await this.userService.delete(name)
      if (response.ok === 1) {
        return res.status(HttpStatus.OK).json({})
      }
      return res.status(HttpStatus.CONFLICT).json({ message: 'User has not been deleted' })
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
    }
  }
}
