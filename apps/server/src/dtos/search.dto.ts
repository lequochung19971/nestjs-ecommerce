import { StringField } from 'src/decorators/fields/string-field.decorator';

export class SearchDto {
  @StringField({
    notEmpty: true,
    each: true,
  })
  columns: string[];

  @StringField({
    notEmpty: true,
  })
  value: string;
}
