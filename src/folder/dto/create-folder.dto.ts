import { IColor } from '../interfaces/color.interface';

export class CreateFolderDto {
  readonly name: string
  readonly isPublic: boolean
  readonly color: IColor
}