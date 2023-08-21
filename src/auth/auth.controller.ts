import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: RegisterUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get()
  @Auth()
  getInfo(@GetUser() user: User) {
    return this.authService.getInfo(user);
  }

  @Patch()
  @Auth()
  updateInfo(@Body() updateUserInfo: UpdateUserDto, @GetUser('id') id: string) {
    return this.authService.updateInfo(updateUserInfo, id);
  }
}
