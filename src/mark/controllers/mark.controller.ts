import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import { Request, Response } from 'express'
import { MarkService } from '../services/mark.service'
import { CreateMarkDto } from '../dto/create-mark.dto'
import { IMark } from '../interfaces/mark.interface'
import { EditMarkDto } from '../dto/edit-mark.dto'
import { ObjectId } from 'mongoose'
import { FolderService } from '../../folder/services/folder.service'
import { ITag } from '../interfaces/tag.interface'
import { IType } from '../interfaces/type.interface'
import { CreateMarkDtoToMarkMapper } from '../dto/create-mark-dto-to-mark'
import { ICreateMark } from '../interfaces/create-mark.interface'
import { UserService } from '../../user/services/user.service'
import { IEditMark } from '../interfaces/edit-mark.interface'
import { EditMarkDtoToMarkMapper } from '../dto/edit-mark-dto-to-mark'

@Controller('mark')
export class MarkController {
  constructor(
    private readonly markService: MarkService,
    private readonly folderService: FolderService,
    private readonly userService: UserService,
    private readonly createMarkDtoToMarkMapper: CreateMarkDtoToMarkMapper,
    private readonly editMarkDtoToMarkMapper: EditMarkDtoToMarkMapper
  ) {}

  private async getUserFromCookie(cookie): Promise<void> {
    if (!cookie) {
      throw new UnauthorizedException()
    }
    const name: string = await this.userService.verifyToken(cookie)
    if (!name) {
      throw new UnauthorizedException()
    }
  }

  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body('folderId') folderId: string,
    @Body('createMarkDto') createMarkDto: CreateMarkDto
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    await this.getUserFromCookie(cookie)
    const tags: ITag[] = await this.getTagIds(createMarkDto.tags)
    const type: IType = await this.getTypeId(createMarkDto.type)
    const createMark: ICreateMark = this.createMarkDtoToMarkMapper.map(createMarkDto, tags, type)
    const mark: IMark = await this.markService.create(createMark)
    await this.folderService.addMark(folderId, mark._id)
    //TODO: Return mark
    return res.status(HttpStatus.CREATED).json({ mark })
  }

  @Get(':id')
  async get(@Req() req: Request, @Res() res: Response, @Param('id') id: ObjectId) {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    await this.getUserFromCookie(cookie)
    const mark: IMark = await this.markService.get(id)
    return res.status(HttpStatus.OK).json({ mark })
  }

  @Put(':id')
  async edit(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: ObjectId,
    @Body('editMarkDto') editMarkDto: EditMarkDto
  ): Promise<Response> {
    res.setHeader('Access-Control-Allow-Origin', 'https://laster-marka.herokuapp.com')
    const cookie = req.cookies['jwt']
    await this.getUserFromCookie(cookie)
    const tags = await this.getTagIds(editMarkDto.tags)
    const type: IType = await this.getTypeId(editMarkDto.type)
    const editMark: IEditMark = this.editMarkDtoToMarkMapper.map(editMarkDto, tags, type)
    const mark: IMark = await this.markService.edit(id, editMark)
    return res.status(HttpStatus.OK).json({ mark })
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
    const response: { ok?: number; n?: number } & { deletedCount?: number } =
      await this.markService.delete(id)
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

  private async getTypeId(typeName: string): Promise<IType> {
    return await this.markService.searchType(typeName)
  }
}
