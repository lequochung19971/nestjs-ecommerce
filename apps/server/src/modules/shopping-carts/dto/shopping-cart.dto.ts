import { BaseDto } from 'src/dtos/base.dto';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { CartItemDto } from './cart-item.dto';

export class ShoppingCartDto extends BaseDto {
  @ObjectTypeField(() => CartItemDto)
  cartItems: CartItemDto[];
}
