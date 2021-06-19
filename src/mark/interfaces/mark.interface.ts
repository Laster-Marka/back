import { Document } from 'mongoose'
import { IType } from './type.interface';
import { ITag } from './tag.interface';

export interface IMark extends Document {
  title: string
  link: string
  markdown: string
  image: string
  type: IType
  tag: ITag
}
