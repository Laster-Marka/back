import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { MarkService } from '../services/mark.service';
import { CreateMarkDto } from '../dto/create-mark.dto';
import { IMark } from '../interfaces/mark.interface';
import { EditFolderDto } from '../../folder/dto/edit-folder.dto';
import { EditMarkDto } from '../dto/edit-mark.dto';
import { ObjectId } from 'mongoose';

@Controller('mark')
export class MarkController {

  constructor(private readonly markService: MarkService) {}

  @Post('create')
  async create(@Res() res: Response, @Body() createMarkDto: CreateMarkDto): Promise<Response> {
    const mark: IMark = await this.markService.create(createMarkDto)
    return res.status(HttpStatus.CREATED).json({ mark })
  }

  @Get(':id')
  async get(@Res() res: Response, @Param('id') id: ObjectId) {
    const mark: IMark = await this.markService.get(id)
    return res.status(HttpStatus.OK).json({ mark })
  }

  @Put('edit/:id')
  async edit(@Res() res: Response, @Param('id') id: ObjectId, @Body() editMarkDto: EditMarkDto): Promise<Response> {
    const mark: IMark = await this.markService.edit(id, editMarkDto)
    return res.status(HttpStatus.OK).json({ mark })
  }

  @Delete('delete/:id')
  async delete(@Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    const response: { ok?: number; n?: number; } & { deletedCount?: number; } = await this.markService.delete(id)
    return res.status(HttpStatus.OK).json({ response })
  }
}
