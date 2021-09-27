import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { IFolder } from '../interfaces/folder.interface';
import { FolderService } from '../services/folder.service';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { EditFolderDto } from '../dto/edit-folder.dto';
import { ObjectId } from 'mongoose';
import { UserService } from '../../user/services/user.service';

@Controller('folder')
export class FolderController {

  constructor(
    private readonly folderService: FolderService,
    private readonly userService: UserService
  ) {}

  @Post()
  async create(@Res() res: Response, @Body() createFolderDto: CreateFolderDto): Promise<Response> {
    const name = "patxi"
    const folder: IFolder = await this.folderService.create(createFolderDto)
    await this.userService.addFolder(name, folder._id)
    return res.status(HttpStatus.CREATED).json({ folder })
  }

  @Get(':id')
  async get(@Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    const folder: IFolder = await this.folderService.get(id)
    return res.status(HttpStatus.CREATED).json({ folder })
  }

  @Put(':id')
  async edit(@Res() res: Response, @Param('id') id: ObjectId, @Body() editFolderDto: EditFolderDto): Promise<Response> {
    const folder: IFolder = await this.folderService.edit(id, editFolderDto)
    return res.status(HttpStatus.OK).json({ folder })
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    const response: any = await this.folderService.delete(id)
    await this.userService.deleteFolderRef(id)
    return res.status(HttpStatus.OK).json({ response })
  }
}
