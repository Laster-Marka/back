import { Injectable } from '@nestjs/common'
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

  async signin(email: string): Promise<string> {
    const user = await this.userModel.findOne({ email })
    if (!user) {
      return "Not user"
    }
    const token = this.jwtService.sign({
      email: user.email,
      password: user.password
    })
    return token
  }

  async get(name: string): Promise<IUser> {
    const user = await this.userModel.findOne( {name: name} )
    return user
  }

  async edit(name: string, editUserDto: EditUserDto): Promise<IUser> {
    const user = await this.userModel.findOneAndUpdate({ name: name  }, { nickname: editUserDto.nickname, profilePic: editUserDto.profilePic  }, {new: true})
    if (!user) {

    }
    return user
  }

  async editPassword(name: string, editPasswordDto: EditPasswordDto): Promise<IUser> {
    const user = await this.userModel.findOneAndUpdate({ name: name }, { password: editPasswordDto.newPassword }, {new: true})
    if (!user) {

    }
    return user
  }

  async getFoldersByUser(idUser: number): Promise<IFolder[]> {
    const user: IUser = await this.userModel.findOne({ _id: idUser })
    const folders = user.folders
    return folders
  }

  special(token: string): any {
    const obj = this.jwtService.verify(token)
    return obj
  }
}
