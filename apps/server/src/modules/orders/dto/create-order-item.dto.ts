import { NumberField } from 'src/decorators/fields/number-field.decorator';
import { StringField } from 'src/decorators/fields/string-field.decorator';

export class CreateOrderItemDto {
  @StringField({
    required: true,
  })
  productId: string;

  @NumberField({
    required: true,
    min: 1,
    max: 1000,
  })
  quantity: number;
}
