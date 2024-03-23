import { ArrayTypeField } from 'src/decorators/fields/array-type-field.decorator';
import { StringField } from 'src/decorators/fields/string-field.decorator';
import { UpdateOrderItemDto } from './update-order-item.dto';

export class UpdateOrderDto {
  @StringField({
    notEmpty: true,
  })
  id: string;

  @ArrayTypeField(() => UpdateOrderItemDto, {
    optional: true,
  })
  orderItems?: UpdateOrderItemDto[];
}
