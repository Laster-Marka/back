import { Body, Controller, Get, HttpStatus, Post, Res, Headers, Put, Param } from '@nestjs/common';
import { Response } from 'express'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { EditUserDto } from '../dto/edit-user.dto'
import { EditPasswordDto } from '../dto/edit-password.dto'
import { GetUserDto } from '../dto/get-user.dto'
import { IUser } from '../interfaces/user.interface'
import { IFolder } from '../../folder/interfaces/folder.interface';
import { FolderService } from '../../folder/services/folder.service';
import { ObjectId } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly folderService: FolderService
  ) {}

  @Post('signup')
  async signup(@Res() res: Response, @Body() createUserDto: CreateUserDto): Promise<Response> {
    const user: IUser = await this.userService.signup(createUserDto)
    return res.status(HttpStatus.CREATED).json({ user })
  }

  @Post('signin')
  async signin(@Res() res: Response, @Body() getUserDto: GetUserDto) {
    const token: string = await this.userService.signin(getUserDto.email)
    return res.status(HttpStatus.OK).json({ token })
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

  @Post('folders')
  async getFolders(@Res() res: Response, @Headers('x-access-token') token: string) {
    const idUser = 1
    const folders = await this.userService.getFoldersByUser(idUser)
    const foldersWithMarks: IFolder[] = []
    folders.map(async (folder) => {
      const folderWithMark: IFolder = await this.folderService.getMarksByFolder(folder._id)
      foldersWithMarks.push(folderWithMark)
    })
    return res.status(HttpStatus.OK).json({ folders })
  }

  @Get('special')
  special(@Res() res: Response, @Headers('x-access-token') token: string) {
    const obj: any = this.userService.special(token)
    return res.status(HttpStatus.OK).json({ obj })
  }
}
