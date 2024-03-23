import { StringField } from 'src/decorators/fields/string-field.decorator';
import { BaseDto } from 'src/dtos/base.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { OrderItemDto } from './order-item.dto';

export class OrderDto extends BaseDto {
  @StringField({
    notEmpty: true,
  })
  id: string;

  @ObjectTypeField(() => UserDto)
  user: UserDto;

  @ObjectTypeField(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
