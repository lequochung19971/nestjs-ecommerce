import { ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min, ValidationOptions } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ToArray } from '../transform.decorator';
import { BaseFieldOption } from './base-field-option.interface';

interface INumberFieldOptions extends BaseFieldOption {
  each?: boolean;
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
  notEmpty?: ValidationOptions | boolean;
}

export function NumberField(options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {}): PropertyDecorator {
  const decorators = [Type(() => Number)];

  if (options.optional) {
    decorators.push(typeof options.optional === 'boolean' ? IsOptional() : IsOptional(options.optional));
  }

  if (options.notEmpty) {
    decorators.push(typeof options.notEmpty === 'boolean' ? IsNotEmpty() : IsNotEmpty(options.notEmpty));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.int) {
    decorators.push(IsInt({ each: options.each }));
  } else {
    decorators.push(IsNumber({}, { each: options.each }));
  }

  if (typeof options.min === 'number') {
    decorators.push(Min(options.min, { each: options.each }));
  }

  if (typeof options.max === 'number') {
    decorators.push(Max(options.max, { each: options.each }));
  }

  if (options.isPositive) {
    decorators.push(IsPositive({ each: options.each }));
  }

  return applyDecorators(...decorators);
}
