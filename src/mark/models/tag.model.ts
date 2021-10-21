import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ timestamps: true, versionKey: false })
export class Tag<ITag> {
  @Prop({ required: true, unique: true })
  name: string
}

export const TagSchema = SchemaFactory.createForClass(Tag)
