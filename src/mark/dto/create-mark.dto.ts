import { ITag } from '../interfaces/tag.interface'

export class CreateMarkDto {
  readonly title: string
  readonly link: string
  readonly description: string
  readonly markdown: string
  readonly image: string
  readonly type: string
  readonly tags: ITag[]
}
