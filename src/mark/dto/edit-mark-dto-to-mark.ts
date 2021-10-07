import { IType } from '../interfaces/type.interface';
import { ITag } from '../interfaces/tag.interface';
import { EditMarkDto } from './edit-mark.dto';
import { IEditMark } from '../interfaces/edit-mark.interface';


export class EditMarkDtoToMarkMapper {
  map(editMarkDto: EditMarkDto, tags: ITag[], type: IType): IEditMark {
    return {
      title: editMarkDto.title,
      link: editMarkDto.link,
      description: editMarkDto.description,
      markdown: editMarkDto.markdown,
      image: editMarkDto.image,
      type: type,
      tags: tags
    }
  }
}
