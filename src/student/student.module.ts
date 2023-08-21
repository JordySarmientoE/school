import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { TeacherController } from './student.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TeacherController],
  providers: [StudentService],
  imports: [UserModule, AuthModule],
})
export class StudentModule {}
