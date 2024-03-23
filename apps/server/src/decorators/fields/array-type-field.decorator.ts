import { ApiPropertyOptions } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';
import { Type, TypeHelpOptions } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { BaseFieldOption } from './base-field-option.interface';
import { IsNotArrayEmpty } from '../is-array-not-empty.decorator';

interface IArrayTypeFieldOptions extends BaseFieldOption {
  /**
   * Will check null, undefined, and empty array (value.length > 0)
   */
  notEmpty?: ValidationOptions | boolean;
}

export function ArrayTypeField(
  typeFunction: (type?: TypeHelpOptions) => Function,
  options: Omit<ApiPropertyOptions, 'type'> & IArrayTypeFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsArray(), Type(typeFunction), ValidateNested()];

  if (options.optional) {
    decorators.push(
      typeof options.optional === 'boolean'
        ? IsOptional()
        : IsOptional(options.optional),
    );
  }

  if (options.notEmpty) {
    decorators.push(IsNotArrayEmpty());
  }

  return applyDecorators(...decorators);
}
