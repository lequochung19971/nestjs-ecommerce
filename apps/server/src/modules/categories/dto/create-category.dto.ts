import { StringField } from 'src/decorators/fields/string-field.decorator';

export class CreateCategoryDto {
  @StringField({
    notEmpty: true,
  })
  title: string;

  @StringField({
    optional: true,
  })
  description?: string;

  @StringField()
  parentId?: string;

  @StringField({
    each: true,
    optional: true,
  })
  mediaIds?: string[];
}
