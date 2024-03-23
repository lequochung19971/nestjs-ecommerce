import { ArrayTypeField } from 'src/decorators/fields/array-type-field.decorator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ArrayTypeField(() => CreateOrderItemDto, {
    notEmpty: true,
  })
  orderItems: CreateOrderItemDto[];
}
