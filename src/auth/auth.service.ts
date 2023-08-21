import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SendError } from 'src/helpers/error';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { decrypt } from 'src/helpers/bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { TypeUsers } from 'src/constants/roles';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  private service = 'AuthService';

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: RegisterUserDto) {
    try {
      const user = await this.userService.create(
        createUserDto,
        createUserDto.role as TypeUsers,
      );
      return {
        ...user,
        token: this.getJwtToken({
          id: user.id,
          role: user.role,
        }),
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userService.getByEmail(email);
      if (!user) throw new UnauthorizedException('Credentials are not valid');
      const match = await decrypt(password, user.password);
      if (!match) throw new UnauthorizedException('Credentials are not valid');
      const userFinal = await this.userService.findOne(user.id);
      return {
        ...userFinal,
        token: this.getJwtToken({
          id: user.id,
          role: user.role,
        }),
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async getInfo(user: User) {
    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
        role: user.role,
      }),
    };
  }

  async updateInfo(updateUserDto: UpdateUserDto, id: string) {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
