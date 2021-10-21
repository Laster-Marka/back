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
  UnauthorizedException
} from '@nestjs/common'
import { Request, Response } from 'express'
import { IFolder } from '../interfaces/folder.interface'
import { FolderService } from '../services/folder.service'
import { CreateFolderDto } from '../dto/create-folder.dto'
import { EditFolderDto } from '../dto/edit-folder.dto'
import { ObjectId } from 'mongoose'
import { UserService } from '../../user/services/user.service'

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
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body('createFolderDto') createFolderDto: CreateFolderDto
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    const name: string = await this.getUserFromCookie(cookie)
    if (createFolderDto) {
      const folder: IFolder = await this.folderService.create(createFolderDto)
      await this.userService.addFolder(name, folder._id)
      return res.status(HttpStatus.CREATED).json({})
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }

  @Get(':id')
  async get(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: ObjectId
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    await this.getUserFromCookie(cookie)
    if (id) {
      const folder: IFolder = await this.folderService.get(id)
      return res.status(HttpStatus.CREATED).json({ folder })
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }

  @Put(':id')
  async edit(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: ObjectId,
    @Body('editFolderDto') editFolderDto: EditFolderDto
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    await this.getUserFromCookie(cookie)
    if (id && editFolderDto) {
      const folder: IFolder = await this.folderService.edit(id, editFolderDto)
      return res.status(HttpStatus.OK).json({ folder })
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: ObjectId
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    await this.getUserFromCookie(cookie)
    if (id) {
      try {
        const response: { ok?: number; n?: number } & { deletedCount?: number } =
          await this.folderService.delete(id)
        if (response.ok === 1) {
          await this.userService.deleteFolderRef(id)
          return res.status(HttpStatus.OK).json({})
        }
        return res.status(HttpStatus.CONFLICT).json({ message: 'Folder has not been deleted' })
      } catch (e) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Internal server error' })
      }
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' })
  }
}
