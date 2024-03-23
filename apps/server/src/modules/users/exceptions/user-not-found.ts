import { NotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/enums/errorCode';

export class UserNotFound extends NotFoundException {
  constructor() {
    super(ErrorCode.USERS_NOT_FOUND);
  }
}
