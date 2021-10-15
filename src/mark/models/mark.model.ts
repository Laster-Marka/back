import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Schema as MongoSchema } from 'mongoose'
import { IType } from '../interfaces/type.interface'
import { ITag } from '../interfaces/tag.interface'

@Schema({ timestamps: true, versionKey: false })
export class Mark<IMark> {
  @Prop()
  title: string

  @Prop()
  link: string

  @Prop()
  markdown: string

  @Prop()
  description: string

  @Prop()
  image: string

  @Prop({ required: true, type: [{ type: MongoSchema.Types.ObjectId, ref: 'Type' }] })
  type: IType

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId, ref: 'Tag' }] })
  tags: ITag[]
}

export const MarkSchema = SchemaFactory.createForClass(Mark)
