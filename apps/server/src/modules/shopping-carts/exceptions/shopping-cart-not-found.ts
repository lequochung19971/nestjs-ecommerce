import { NotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/enums/errorCode';

export class ShoppingCartNotFound extends NotFoundException {
  constructor() {
    super(ErrorCode.SHOPPING_CARTS_NOT_FOUND);
  }
}
