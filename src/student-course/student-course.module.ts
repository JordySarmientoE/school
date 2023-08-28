import { Module } from '@nestjs/common';
import { StudentCourseService } from './student-course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCourse } from './entities/student-course.entity';

@Module({
  providers: [StudentCourseService],
  exports: [StudentCourseService],
  imports: [TypeOrmModule.forFeature([StudentCourse])],
})
export class StudentCourseModule {}
