import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Order } from 'src/enums/order.enum';
import { NumberField } from 'src/decorators/fields/number-field.decorator';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { BooleanField } from 'src/decorators/fields/boolean-field.decorator';
import { SearchDto } from './search.dto';

export class QueryParamsDto {
  @IsOptional()
  @IsEnum(Order)
  readonly order?: Order;

  @IsOptional()
  readonly orderColumn?: string;

  @NumberField()
  readonly page: number;

  @NumberField({
    min: 1,
    max: 50,
  })
  readonly take: number;

  @BooleanField({
    optional: true,
  })
  includeTotalCount?: boolean;

  @ObjectTypeField(() => SearchDto)
  @IsOptional()
  search?: SearchDto;

  get skip() {
    return (this.page - 1) * this.take;
  }
}
