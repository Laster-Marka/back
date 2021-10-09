import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { IMark } from '../interfaces/mark.interface'
import { ITag } from '../interfaces/tag.interface'
import { IType } from '../interfaces/type.interface'
import { ICreateMark } from '../interfaces/create-mark.interface'
import { IEditMark } from '../interfaces/edit-mark.interface'

@Injectable()
export class MarkService {
  constructor(
    @InjectModel('Mark') private markModel: Model<IMark>,
    @InjectModel('Tag') private tagModel: Model<ITag>,
    @InjectModel('Type') private typeModel: Model<IType>
  ) {}

  async create(createMark: ICreateMark): Promise<IMark> {
    const mark = new this.markModel(createMark)
    return await mark.save()
  }

  async get(id: ObjectId): Promise<IMark> {
    const mark: IMark = await this.markModel
      .findOne({ _id: id })
      .populate({ path: 'type', select: 'name -_id' })
      .populate({ path: 'tags', select: 'name -_id' })
    if (!mark) {
      //return "Mark not found"
    }
    return mark
  }

  async edit(id: ObjectId, editMark: IEditMark): Promise<IMark> {
    const mark = await this.markModel
      .findByIdAndUpdate(
        { _id: id },
        {
          title: editMark.title,
          link: editMark.link,
          markdown: editMark.markdown,
          description: editMark.description,
          image: editMark.image,
          type: editMark.type,
          tags: editMark.tags
        },
        { new: true }
      )
      .populate({ path: 'type', select: 'name -_id' })
      .populate({ path: 'tags', select: 'name -_id' })
    if (!mark) {
    }
    return mark
  }

  async delete(id: ObjectId): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const response = await this.markModel.deleteOne({ _id: id })
    return response
  }

  async searchTag(tag: ITag): Promise<ITag> {
    const resTag = await this.tagModel.findOne({ name: tag.name.toUpperCase() })
    return resTag
  }

  async createTag(tag: ITag): Promise<ITag> {
    const newTag = new this.tagModel({ name: tag.name.toUpperCase() })
    return newTag.save()
  }

  async searchType(typeName: string): Promise<IType> {
    return await this.typeModel.findOne({ name: typeName })
  }
}
