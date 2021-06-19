import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ICountry } from '../interfaces/country.interface'

@Schema({ versionKey: false })
export class Country<ICountry> {
  @Prop({ required: true, unique: true })
  name: string
}

export const CountrySchema = SchemaFactory.createForClass(Country)
