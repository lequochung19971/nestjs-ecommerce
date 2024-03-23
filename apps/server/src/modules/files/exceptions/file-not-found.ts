import { NotFoundException } from '@nestjs/common';
import { ErrorCode } from 'src/enums/errorCode';

export class FileNotFound extends NotFoundException {
  constructor() {
    super(ErrorCode.FILE_NOT_FOUND);
  }
}
