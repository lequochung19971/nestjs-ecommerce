import { IsOptional } from 'class-validator';
import { StringField } from 'src/decorators/fields/string-field.decorator';

export class CreateProductDto {
  @StringField({
    notEmpty: true,
  })
  title: string;

  @StringField({
    optional: true,
  })
  description?: string;

  @StringField({
    each: true,
    optional: true,
  })
  mediaIds?: string[];

  @StringField({
    each: true,
    optional: true,
  })
  categoryIds?: string[];
}
