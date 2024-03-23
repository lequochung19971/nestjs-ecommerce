import { ArrayTypeField } from 'src/decorators/fields/array-type-field.decorator';
import { AddCartItemDto } from './add-cart-item.dto';

export class AddCartDto {
  @ArrayTypeField(() => AddCartItemDto, {
    notEmpty: true,
  })
  cartItems: AddCartItemDto[];
}
