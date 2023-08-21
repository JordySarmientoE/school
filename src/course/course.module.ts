import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [AuthModule],
})
export class CourseModule {}
