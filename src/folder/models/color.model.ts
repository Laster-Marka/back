import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false })
export class Color<IColor> {
  @Prop({ required: true, unique: true })
  name: string
}

export const ColorSchema = SchemaFactory.createForClass(Color)
