import { ValidationOptions } from 'class-validator';

export interface BaseFieldOption {
  optional?: ValidationOptions | boolean;
}
