import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { SubjectModule } from 'src/subject/subject.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { StudentCourseModule } from 'src/student-course/student-course.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Course]),
    ClassroomModule,
    SubjectModule,
    TeacherModule,
    StudentCourseModule,
    StudentModule,
  ],
  exports: [CourseService],
})
export class CourseModule {}
