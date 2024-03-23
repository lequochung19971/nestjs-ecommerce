import { NotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/enums/errorCode';

export class OrderDetailNotFound extends NotFoundException {
  constructor() {
    super(ErrorCode.ORDER_DETAILS_NOT_FOUND);
  }
}
