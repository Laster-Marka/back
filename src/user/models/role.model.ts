import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ versionKey: false })
export class Role<IRole> {
  @Prop({ required: true, unique: true })
  name: string
}

export const RoleSchema = SchemaFactory.createForClass(Role)
