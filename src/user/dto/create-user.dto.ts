import { IFolder } from '../../folder/interfaces/folder.interface';
import { IType } from '../../mark/interfaces/type.interface';
import { ITag } from '../../mark/interfaces/tag.interface';

export class CreateUserDto {
  readonly email: string
  readonly password: string
  readonly confirmPassword: string
  readonly name: string
}
