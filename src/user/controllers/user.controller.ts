import { Body, Controller, Get, HttpStatus, Post, Res, Put, Param, Delete } from '@nestjs/common'
import { Response } from 'express'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { EditUserDto } from '../dto/edit-user.dto'
import { EditPasswordDto } from '../dto/edit-password.dto'
import { GetUserDto } from '../dto/get-user.dto'
import { IUser } from '../interfaces/user.interface'
import { AuthService } from '../../auth/auth.service'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  async signUp(@Res() res: Response, @Body() createUserDto: CreateUserDto): Promise<Response> {
    const user: IUser = await this.userService.signup(createUserDto)
    return res.status(HttpStatus.CREATED).json({ user })
  }

  @Post('login')
  async logIn(@Res() res: Response, @Body() getUserDto: GetUserDto) {
    const user: IUser | null = await this.authService.validateUser(
      getUserDto.email,
      getUserDto.password
    )
    if (user) {
      const token = await this.authService.login(user)
      return res.status(HttpStatus.OK).json({ token })
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Wrong user or password' })
    }
  }

  @Post('logout')
  async logOut(@Res() res: Response, @Body() getUserDto: GetUserDto) {
    if (getUserDto) {
      const token = await this.authService.logout(getUserDto)
      return res.status(HttpStatus.OK).json()
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Internal Error' })
    }
  }

  @Get(':name')
  async get(@Res() res: Response, @Param('name') name: string) {
    const user: IUser = await this.userService.get(name)
    return res.status(HttpStatus.OK).json({ user })
  }

  @Put('edit/:name')
  async edit(@Res() res: Response, @Param('name') name: string, @Body() editUserDto: EditUserDto) {
    const user: IUser = await this.userService.edit(name, editUserDto)
    return res.status(HttpStatus.OK).json({ user })
  }

  @Put('edit/password/:name')
  async editPassword(@Res() res: Response, @Param('name') name: string, @Body() editPasswordDto: EditPasswordDto) {
    const user: IUser = await this.userService.editPassword(name, editPasswordDto)
    return res.status(HttpStatus.OK).json({ user })
  }

  @Delete('delete/:name')
  async delete(@Res() res: Response, @Param('name') name: string): Promise<Response> {
    const response: { ok?: number; n?: number } & { deletedCount?: number; } = await this.userService.delete(name)
    return res.status(HttpStatus.OK).json({ response })
  }

  // @Get('special')
  // special(@Res() res: Response, @Headers('x-access-token') token: string) {
  //   const obj: any = this.userService.special(token)
  //   return res.status(HttpStatus.OK).json({ obj })
  // }
}
