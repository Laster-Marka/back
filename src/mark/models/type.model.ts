import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false })
export class Type<IType> {
  @Prop({ required: true, unique: true })
  name: string
}

export const TypeSchema = SchemaFactory.createForClass(Type)
