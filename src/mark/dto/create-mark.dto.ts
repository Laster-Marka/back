import { IType } from '../interfaces/type.interface';
import { ITag } from '../interfaces/tag.interface';

export class CreateMarkDto {
  readonly title: string
  readonly link: string
  readonly markdown: string
  readonly image: string
  readonly type: IType
  tags: ITag[]
}