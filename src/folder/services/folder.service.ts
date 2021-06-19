import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { EditFolderDto } from '../dto/edit-folder.dto';
import { IFolder } from '../interfaces/folder.interface';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel('Folder') private folderModel: Model<IFolder>
  ) {}

  async create(createFolderDto: CreateFolderDto): Promise<IFolder> {
    const folder = new this.folderModel(createFolderDto)
    return folder.save()
  }

  async get(id: ObjectId): Promise<IFolder> {
    const folder = await this.folderModel.findOne( {_id: id} )
    return folder
  }

  async edit(id: ObjectId, editFolderDto: EditFolderDto): Promise<IFolder> {
    const folder = await this.folderModel.findByIdAndUpdate({ _id: id  }, { name: editFolderDto.name, isPublic: editFolderDto.isPublic, color: editFolderDto.color  }, {new: true})
    if (!folder) {

    }
    return folder
  }

  async getMarksByFolder(idFolder: number): Promise<IFolder> {
    const folder = await this.folderModel.findOne({ _id: idFolder })
    if (!folder) {
      //return "Folder not found"
    }
    return folder
  }

  async delete(id: ObjectId): Promise<any> {
    const response = await this.folderModel.deleteOne({ _id: id })
    return response
  }
}
