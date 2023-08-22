import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(8)
  dni: string;

  @IsString()
  @MinLength(8)
  @MaxLength(9)
  phone: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  status?: string;
}
