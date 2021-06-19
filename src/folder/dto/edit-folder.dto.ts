import { IColor } from '../interfaces/color.interface';

export class EditFolderDto {
  readonly name: string
  readonly isPublic: boolean
  readonly color: IColor
}