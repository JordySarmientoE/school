import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourse } from './entities/student-course.entity';
import { Repository } from 'typeorm';
import { SendError } from 'src/helpers/error';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StudentCourseService {
  private service = 'StudentCourseService';
  constructor(
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,
  ) {}

  async insertStudentCourse(courses: Course[], students: User[]) {
    try {
      const studentCourses = [];
      students.forEach((student) => {
        courses.forEach((course) => {
          const studentCourse = new StudentCourse();
          studentCourse.course = course;
          studentCourse.student = student;
          studentCourses.push(studentCourse);
        });
      });
      await this.studentCourseRepository
        .createQueryBuilder()
        .insert()
        .values(studentCourses)
        .execute();
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
