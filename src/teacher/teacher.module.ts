import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService],
  imports: [UserModule, AuthModule],
})
export class TeacherModule {}
