import { IsNumber, Min } from 'class-validator';
import { NumberField } from 'src/decorators/fields/number-field.decorator';
import { StringField } from 'src/decorators/fields/string-field.decorator';

export class AddCartItemDto {
  @StringField({
    optional: true,
  })
  id?: string;

  @StringField({
    required: true,
  })
  productId: string;

  // @NumberField({
  //   notEmpty: true,
  //   min: 1,
  //   max: 1000,
  // })
  @IsNumber()
  @Min(1)
  quantity: number;
}
