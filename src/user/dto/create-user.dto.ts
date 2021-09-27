import { IFolder } from '../../folder/interfaces/folder.interface';
import { IType } from '../../mark/interfaces/type.interface';
import { ITag } from '../../mark/interfaces/tag.interface';

export class CreateUserDto {
  readonly email: string
  readonly password: string
  readonly markdown: string
  readonly image: string
  readonly folder: IFolder
  readonly type: IType
  readonly tag: ITag
}
