import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Config<IConfig> {
  @Prop({ required: true, default: true })
  isRepoForAny: boolean

  @Prop({ required: true, default: true })
  isBoardForAny: boolean

  @Prop({ required: true, default: true })
  canCommentAny: boolean
}

export const ConfigSchema = SchemaFactory.createForClass(Config)
