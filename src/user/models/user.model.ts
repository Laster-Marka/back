import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongoSchema } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import { IRole } from '../interfaces/role.interface'
import { ICountry } from '../interfaces/country.interface'
import { IConfig } from '../interfaces/config.interface'
import { IFolder } from '../../folder/interfaces/folder.interface';

@Schema({ timestamps: true, versionKey: false })
export class User<IUser> {
  @Prop({ required: true, unique: true })
  name: string

  @Prop()
  nickname: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  profilePic: string

  @Prop({ required: true, type: [{ type: MongoSchema.Types.ObjectId, ref: 'Role' }] })
  role: IRole

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: 'Folder' }] })
  folders: IFolder[]

  @Prop({
    required: true,
    type: [{ type: MongoSchema.Types.ObjectId, ref: 'Country' }]
  })
  country: ICountry

  @Prop({
    required: true,
    type: [{ type: MongoSchema.Types.ObjectId, ref: 'Configuration' }]
  })
  config: IConfig

}

export const UserSchema = SchemaFactory.createForClass(User)
