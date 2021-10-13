import { CreateMarkDto } from './create-mark.dto'
import { IType } from '../interfaces/type.interface'
import { ITag } from '../interfaces/tag.interface'
import { ICreateMark } from '../interfaces/create-mark.interface'

export class CreateMarkDtoToMarkMapper {
  map(createMarkDto: CreateMarkDto, tags: ITag[], type: IType): ICreateMark {
    return {
      title: createMarkDto.title,
      link: createMarkDto.link,
      description: createMarkDto.description,
      markdown: createMarkDto.markdown,
      image: createMarkDto.image,
      type: type,
      tags: tags
    }
  }
}
