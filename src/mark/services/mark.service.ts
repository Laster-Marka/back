import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { IMark } from '../interfaces/mark.interface';
import { CreateMarkDto } from '../dto/create-mark.dto';
import { EditMarkDto } from '../dto/edit-mark.dto';

@Injectable()
export class MarkService {
  constructor(
    @InjectModel('Mark') private markModel: Model<IMark>
  ) {}

  async create(createMarkDto: CreateMarkDto): Promise<IMark> {
    const folder = new this.markModel(createMarkDto)
    return folder.save()
  }

  async get(id: ObjectId): Promise<IMark> {
    const mark: IMark = await this.markModel.findOne({ _id: id })
    if (!mark) {
      //return "Mark not found"
    }
    return mark
  }

  async edit(id: ObjectId, editMarkDto: EditMarkDto): Promise<IMark> {
    const mark = await this.markModel.findByIdAndUpdate({ _id: id  }, { title: editMarkDto.title, link: editMarkDto.link, markdown: editMarkDto.markdown, image: editMarkDto.image, type: editMarkDto.type, tag: editMarkDto.tag  }, {new: true})
    if (!mark) {

    }
    return mark
  }

  async delete(id: ObjectId): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
    const response = await this.markModel.deleteOne({ _id: id })
    return response
  }
}
