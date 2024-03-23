import { Type } from 'class-transformer';
import { NumberField } from 'src/decorators/fields/number-field.decorator';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { StringField } from 'src/decorators/fields/string-field.decorator';
import { ProductDto } from 'src/modules/products/dto/product-dto';

export class OrderItemDto {
  @StringField({
    notEmpty: true,
  })
  id: string;

  @ObjectTypeField(() => ProductDto)
  product: ProductDto;

  @NumberField({
    required: true,
  })
  quantity: number;
}
