import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongoSchema } from 'mongoose'
import { IColor } from '../interfaces/color.interface'
import { IMark } from '../../mark/interfaces/mark.interface'

@Schema({ timestamps: true, versionKey: false })
export class Folder<IFolder> {
  @Prop()
  name: string

  @Prop({ required: true, default: true })
  isPublic: boolean

  @Prop({ default: 1, type: [{ type: MongoSchema.Types.ObjectId, ref: 'Color' }] })
  color: IColor

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: 'Mark' }] })
  marks: IMark[]
}

export const FolderSchema = SchemaFactory.createForClass(Folder)
