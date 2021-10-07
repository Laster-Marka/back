import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto } from '../dto/create-user.dto'
import { EditUserDto } from '../dto/edit-user.dto'
import { EditPasswordDto } from '../dto/edit-password.dto'
import { IUser } from '../interfaces/user.interface'
import { Model, ObjectId } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IFolder } from '../../folder/interfaces/folder.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private readonly jwtService: JwtService
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<IUser> {
    const user = new this.userModel(createUserDto)
    return user.save()
  }

  async getByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email: email })
    return user
  }

  async get(name: string): Promise<IUser> {
    const user = await this.userModel.findOne({ name: name })
    return user
  }

  async getToken(name: string): Promise<string> {
    const token = await this.jwtService.signAsync({ name: name })
    return token
  }

  async verifyToken(cookie: any): Promise<any> {
    const data = await this.jwtService.verifyAsync(cookie)
    if (!data) {
      throw new UnauthorizedException()
    }
    const user: IUser = await this.get(data['name'])
    if (!user) {
      throw new UnauthorizedException()
    }
    return user.name
  }

  async edit(name: string, editUserDto: EditUserDto): Promise<IUser> {
    const user = await this.userModel.findOneAndUpdate({ name: name  }, { nickname: editUserDto.nickname, profilePic: editUserDto.profilePic  }, {new: true})
    if (!user) {

    }
    return user
  }

  async editPassword(name: string, editPasswordDto: EditPasswordDto): Promise<IUser | null> {
    if (editPasswordDto.oldPassword !== editPasswordDto.oldConfirmPassword){
      return null
    }
    const user: IUser | null = await this.userModel.findOneAndUpdate({ name: name }, { password: editPasswordDto.newPassword }, {new: true})
    if (!user) {
      return null
    }
    return user
  }

  async delete(name: string): Promise<{ ok?: number; n?: number; } & { deletedCount?: number; }> {
    const response = await this.userModel.deleteOne({ name: name })
    return response
  }

  async getFoldersByUser(name: string): Promise<IFolder[]> {
    const user: IUser = await this.userModel.findOne({ name: name }).populate({
      path: 'folders',
      populate: {
        path: 'marks',
        populate: [
          {
            path: 'tags'
          },
          {
            path: 'type'
          }
        ]
      }
    })
    const folders = user.folders
    return folders
  }

  async addFolder(name: string, id: ObjectId): Promise<void> {
    const user: IUser = await this.userModel.findOneAndUpdate({ name: name },{ $push: {folders: id} }, {new: true})
  }

  async deleteFolderRef(id: any): Promise<void> {
    const user: IUser = await this.userModel.findOneAndUpdate(
      { folders: { $in: [id] } },
      { $pull: { folders: id } }
    )
  }
}
