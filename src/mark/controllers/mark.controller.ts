import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { MarkService } from '../services/mark.service';
import { CreateMarkDto } from '../dto/create-mark.dto';
import { IMark } from '../interfaces/mark.interface';
import { EditFolderDto } from '../../folder/dto/edit-folder.dto';
import { EditMarkDto } from '../dto/edit-mark.dto';
import { ObjectId } from 'mongoose';
import { FolderService } from '../../folder/services/folder.service';
import { ITag } from '../interfaces/tag.interface';

@Controller('mark')
export class MarkController {

  constructor(
    private readonly markService: MarkService,
    private readonly folderService: FolderService
  ) {}

  @Post()
  async create(@Res() res: Response, @Body('folderId') folderId: string, @Body() createMarkDto: CreateMarkDto): Promise<Response> {
    const tags = await this.getTagIds(createMarkDto.tags)
    createMarkDto.tags = tags
    const mark: IMark = await this.markService.create(createMarkDto)
    await this.folderService.addMark(folderId, mark._id)
    //TODO: Return mark
    return res.status(HttpStatus.CREATED).json({ mark })
  }

  @Get(':id')
  async get(@Res() res: Response, @Param('id') id: ObjectId) {
    const mark: IMark = await this.markService.get(id)
    return res.status(HttpStatus.OK).json({ mark })
  }

  @Put(':id')
  async edit(@Res() res: Response, @Param('id') id: ObjectId, @Body() editMarkDto: EditMarkDto): Promise<Response> {
    const tags = await this.getTagIds(editMarkDto.tags)
    editMarkDto.tags = tags
    const mark: IMark = await this.markService.edit(id, editMarkDto)
    return res.status(HttpStatus.OK).json({ mark })
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: ObjectId): Promise<Response> {
    const response: { ok?: number; n?: number; } & { deletedCount?: number; } = await this.markService.delete(id)
    await this.folderService.deleteMarkRef(id)
    return res.status(HttpStatus.OK).json({ response })
  }

  private async getTagIds(tags: ITag[]): Promise<ITag[]> {
    for (const tag of tags) {
      const resTag = await this.markService.searchTag(tag)
      if (!resTag) {
        const newTag = await this.markService.createTag(tag)
        tag._id = newTag._id
      } else {
        tag._id = resTag._id
      }
    }
    return tags
  }
}
