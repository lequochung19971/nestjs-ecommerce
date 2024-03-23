import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidationOptions } from 'class-validator';
import { ToLowerCase, ToUpperCase } from '../transform.decorator';
import { BaseFieldOption } from './base-field-option.interface';

interface IStringFieldOptions extends BaseFieldOption {
  each?: boolean;
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  notEmpty?: ValidationOptions | boolean;
}
export function StringField(options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {}): PropertyDecorator {
  const decorators = [Type(() => String), IsString({ each: options.each })];

  const minLength = options.minLength || 1;

  if (options.optional) {
    decorators.push(typeof options.optional === 'boolean' ? IsOptional() : IsOptional(options.optional));
  }

  if (options.notEmpty) {
    decorators.push(typeof options.notEmpty === 'boolean' ? IsNotEmpty() : IsNotEmpty(options.notEmpty));
  }

  decorators.push(MinLength(minLength, { each: options.each }));

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}
