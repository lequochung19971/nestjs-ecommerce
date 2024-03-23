import { Type } from 'class-transformer';
import { NumberField } from 'src/decorators/fields/number-field.decorator';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { BaseDto } from 'src/dtos/base.dto';
import { ProductDto } from 'src/modules/products/dto/product-dto';

export class CartItemDto extends BaseDto {
  @ObjectTypeField(() => ProductDto)
  product: ProductDto;

  @NumberField()
  number: number;
}
