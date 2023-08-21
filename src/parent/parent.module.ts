import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { TeacherController } from './parent.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TeacherController],
  providers: [ParentService],
  imports: [UserModule, AuthModule],
})
export class ParentModule {}
