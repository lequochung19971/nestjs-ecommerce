import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { QueryResponseMetaDto } from './query-response-meta.dto';

export class QueryResponseDto<T> {
  readonly data: T[];

  @ValidateNested()
  @ObjectTypeField(() => QueryResponseMetaDto)
  readonly meta: QueryResponseMetaDto;

  constructor(props: QueryResponseDto<T>) {
    this.data = props.data;
    this.meta = props.meta;
  }
}
