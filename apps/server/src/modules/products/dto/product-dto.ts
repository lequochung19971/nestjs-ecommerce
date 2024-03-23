import { Type } from 'class-transformer';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { StringField } from 'src/decorators/fields/string-field.decorator';
import { BaseDto } from 'src/dtos/base.dto';
import { File } from 'src/modules/files/entities/file.entity';

export class ProductDto extends BaseDto {
  @StringField({
    notEmpty: true,
  })
  title: string;

  @StringField()
  description?: string;

  @ObjectTypeField(() => File)
  media: File[];
}
