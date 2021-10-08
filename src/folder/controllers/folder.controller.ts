import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IFolder } from '../interfaces/folder.interface';
import { FolderService } from '../services/folder.service';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { EditFolderDto } from '../dto/edit-folder.dto';
import { ObjectId } from 'mongoose';
import { UserService } from '../../user/services/user.service';
import { IUser } from '../../user/interfaces/user.interface';

@Controller('folder')
export class FolderController {

  constructor(
    private readonly folderService: FolderService,
    private readonly userService: UserService
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

  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body('createFolderDto') createFolderDto: CreateFolderDto): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const folder: IFolder = await this.folderService.create(createFolderDto)
    await this.userService.addFolder(name, folder._id)
    return res.status(HttpStatus.CREATED).json({ folder })
  }

  @Get(':id')
  async get(@Req() req: Request, @Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const folder: IFolder = await this.folderService.get(id)
    return res.status(HttpStatus.CREATED).json({ folder })
  }

  @Put(':id')
  async edit(@Req() req: Request, @Res() res: Response, @Param('id') id: ObjectId, @Body('editFolderDto') editFolderDto: EditFolderDto): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const folder: IFolder = await this.folderService.edit(id, editFolderDto)
    return res.status(HttpStatus.OK).json({ folder })
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    const response: any = await this.folderService.delete(id)
    await this.userService.deleteFolderRef(id)
    return res.status(HttpStatus.OK).json({ response })
  }
}
