import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTimeFormat', async: false })
export class IsTimeFormatConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return /^([01]\d|2[0-3]):([0-5]\d):00$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} need to have hour format: HH:mm:00`;
  }
}
