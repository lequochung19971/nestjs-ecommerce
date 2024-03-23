import { NotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/enums/errorCode';

export class CategoryNotFound extends NotFoundException {
  constructor() {
    super(ErrorCode.CATEGORIES_NOT_FOUND);
  }
}
