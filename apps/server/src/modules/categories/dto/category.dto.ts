import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseDto } from 'src/dtos/base.dto';
import { StringField } from 'src/decorators/fields/string-field.decorator';
import { File } from 'src/modules/files/entities/file.entity';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';

export class CategoryDto extends BaseDto {
  @StringField({
    notEmpty: true,
  })
  title: string;

  @StringField({
    optional: true,
  })
  description?: string;

  @ObjectTypeField(() => CategoryDto)
  @IsOptional()
  parent?: CategoryDto;

  @ObjectTypeField(() => CategoryDto)
  @IsOptional()
  children?: CategoryDto[];

  @ObjectTypeField(() => File)
  @IsOptional()
  media?: File[];
}
