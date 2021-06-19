import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { IFolder } from '../interfaces/folder.interface';
import { FolderService } from '../services/folder.service';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { EditFolderDto } from '../dto/edit-folder.dto';
import { ObjectId } from 'mongoose';

@Controller('folder')
export class FolderController {

  constructor(private readonly folderService: FolderService) {}

  @Post('create')
  async create(@Res() res: Response, @Body() createFolderDto: CreateFolderDto): Promise<Response> {
    const folder: IFolder = await this.folderService.create(createFolderDto)
    return res.status(HttpStatus.CREATED).json({ folder })
  }

  @Get(':id')
  async get(@Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    const folder: IFolder = await this.folderService.get(id)
    return res.status(HttpStatus.CREATED).json({ folder })
  }

  @Put('edit/:id')
  async edit(@Res() res: Response, @Param('id') id: ObjectId, @Body() editFolderDto: EditFolderDto): Promise<Response> {
    const folder: IFolder = await this.folderService.edit(id, editFolderDto)
    return res.status(HttpStatus.OK).json({ folder })
  }

  @Delete('delete/:id')
  async delete(@Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    const response: any = await this.folderService.delete(id)
    return res.status(HttpStatus.OK).json({ response })
  }
}
