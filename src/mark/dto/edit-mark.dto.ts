import { IType } from '../interfaces/type.interface'
import { ITag } from '../interfaces/tag.interface'

export class EditMarkDto {
  readonly title: string
  readonly link: string
  readonly description: string
  readonly markdown: string
  readonly image: string
  readonly type: string
  readonly tags: ITag[]
}
