import { IsEmail } from 'class-validator';
import { StringField } from 'src/decorators/fields/string-field.decorator';
import { IsPassword } from 'src/decorators/is-password.decorator';

export class CreateUserDto {
  @StringField({
    minLength: 2,
    notEmpty: true,
  })
  name: string;

  @StringField({
    minLength: 2,
    notEmpty: true,
  })
  username: string;

  @StringField({
    notEmpty: true,
  })
  @IsEmail(
    {
      allow_display_name: false,
    },
    { message: 'Please provide valid Email.' },
  )
  email: string;

  @StringField({
    notEmpty: true,
  })
  @IsPassword()
  password: string;
}
