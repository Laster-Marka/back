import { IType } from './type.interface'
import { ITag } from './tag.interface'

export interface ICreateMark {
  title: string
  link: string
  description: string
  markdown: string
  image: string
  type: IType
  tags: ITag[]
}
