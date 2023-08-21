import { IsIn, IsString } from 'class-validator';
import { TypeUsers } from 'src/constants/roles';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsString()
  @IsIn([TypeUsers.PARENT, TypeUsers.STUDENT])
  role: string;
}
