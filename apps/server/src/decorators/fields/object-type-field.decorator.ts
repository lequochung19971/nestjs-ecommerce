import { ApiPropertyOptions } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';
import { Type, TypeHelpOptions } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { BaseFieldOption } from './base-field-option.interface';
import { IsNotArrayEmpty } from '../is-array-not-empty.decorator';

interface IObjectTypeFieldOptions extends BaseFieldOption {
  /**
   * Will check null, undefined, and empty array (value.length > 0)
   */
  notEmpty?: ValidationOptions | boolean;
}

export function ObjectTypeField(
  typeFunction: (type?: TypeHelpOptions) => Function,
  options: Omit<ApiPropertyOptions, 'type'> & IObjectTypeFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsObject(), Type(typeFunction), ValidateNested()];

  if (options.optional) {
    decorators.push(
      typeof options.optional === 'boolean'
        ? IsOptional()
        : IsOptional(options.optional),
    );
  }

  if (options.notEmpty) {
    decorators.push(IsNotEmpty());
  }

  return applyDecorators(...decorators);
}
