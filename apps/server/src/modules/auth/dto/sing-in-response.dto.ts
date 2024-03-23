import { UserDto } from 'src/modules/users/dto/user.dto';
import { ObjectTypeField } from 'src/decorators/fields/object-type-field.decorator';
import { TokenDto } from './token.dto';

export class SignInResponseDto {
  user: UserDto;

  @ObjectTypeField(() => TokenDto)
  accessToken: TokenDto;

  @ObjectTypeField(() => TokenDto)
  refreshToken: TokenDto;

  constructor(props: SignInResponseDto) {
    this.user = props.user;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
  }
}
