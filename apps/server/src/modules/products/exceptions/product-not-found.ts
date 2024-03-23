import { NotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/enums/errorCode';

export class ProductNotFound extends NotFoundException {
  constructor() {
    super(ErrorCode.PRODUCTS_NOT_FOUND);
  }
}
