import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false })
export class Country<ICountry> {
  @Prop({ required: true, unique: true })
  name: string
}

export const CountrySchema = SchemaFactory.createForClass(Country)
