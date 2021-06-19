import { Document } from 'mongoose'
import { IColor } from './color.interface';

export interface IFolder extends Document {
  name: string
  isPublic: boolean
  color: IColor
}
