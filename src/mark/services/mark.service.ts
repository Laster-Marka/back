import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IMark } from '../interfaces/mark.interface';
import { CreateMarkDto } from '../dto/create-mark.dto';
import { EditMarkDto } from '../dto/edit-mark.dto';
import { ITag } from '../interfaces/tag.interface';
import { IFolder } from '../../folder/interfaces/folder.interface';

@Injectable()
export class MarkService {
  constructor(
    @InjectModel('Mark') private markModel: Model<IMark>,
    @InjectModel('Tag') private tagModel: Model<ITag>
  ) {}

  async create(createMarkDto: CreateMarkDto): Promise<IMark> {
    const mark = new this.markModel(createMarkDto)
    return mark.save()
   }

  async get(id: ObjectId): Promise<IMark> {
    const mark: IMark = await this.markModel.findOne({ _id: id })
    if (!mark) {
      //return "Mark not found"
    }
    return mark
  }

  async edit(id: ObjectId, editMarkDto: EditMarkDto): Promise<IMark> {
    const mark = await this.markModel.findByIdAndUpdate({ _id: id  }, { title: editMarkDto.title, link: editMarkDto.link, markdown: editMarkDto.markdown, image: editMarkDto.image, type: editMarkDto.type, tags: editMarkDto.tags  }, {new: true})
    if (!mark) {

    }
    return mark
  }

  async delete(id: ObjectId): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
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
}
