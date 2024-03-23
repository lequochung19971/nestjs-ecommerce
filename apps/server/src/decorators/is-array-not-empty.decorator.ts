import { applyDecorators } from '@nestjs/common';
import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsNotArrayEmptyValidator implements ValidatorConstraintInterface {
  validate(value?: unknown[]) {
    return !!value?.length;
  }

  defaultMessage(args: ValidationArguments) {
    // Error message to be returned if validation fails
    return `${args.targetName} array is not empty`;
  }
}

export function IsNotArrayEmpty(
  options = {} as ValidationOptions,
): PropertyDecorator {
  return applyDecorators(Validate(IsNotArrayEmptyValidator, options));
}
