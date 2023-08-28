import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { ClassroomService } from 'src/classroom/classroom.service';
import { SendError } from 'src/helpers/error';
import { TeacherService } from 'src/teacher/teacher.service';
import { SubjectService } from 'src/subject/subject.service';
import { Status } from 'src/constants/roles';
import { SearchCourseDto } from './dto/search-course.dto';
import { InsertStudentCourseDto } from './dto/insert-student-course.dto';
import { StudentCourseService } from 'src/student-course/student-course.service';
import { StudentService } from 'src/student/student.service';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from 'src/user/entities/user.entity';
import { Classroom } from 'src/classroom/entities/classroom.entity';

@Injectable()
export class CourseService {
  private service = 'CourseService';
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly classroomService: ClassroomService,
    private readonly teacherService: TeacherService,
    private readonly subjectService: SubjectService,
    private readonly studentCourseService: StudentCourseService,
    private readonly studentService: StudentService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      const { teacher, classroom, subject, hourPerWeek } = createCourseDto;
      const [materia, profesor, salon] = await Promise.all([
        this.subjectService.findOne(subject),
        teacher ? this.teacherService.findOne(teacher) : Promise.resolve(null),
        classroom
          ? this.classroomService.findOne(classroom)
          : Promise.resolve(null),
      ]);
      const subjectsPerClassroom =
        salon?.courses.map((course) => course.subject.id) ?? [];
      if (subjectsPerClassroom.includes(subject))
        throw new BadRequestException('Classroom has this course');
      const course = this.courseRepository.create({
        hourPerWeek,
        subject: materia,
        ...(teacher && { teacher: profesor }),
        ...(classroom && { classroom: salon }),
      });
      await this.courseRepository.save(course);
      if (salon && salon.students.length > 0) {
        const courses = [course];
        await this.studentCourseService.insertStudentCourse(
          courses,
          salon.students,
        );
      }
      return course;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findAll(searchCourseDto: SearchCourseDto) {
    const { limit, offset, status, subject, classroom, teacher } =
      searchCourseDto;
    const filter = {
      subject,
      classroom,
      teacher,
    };
    let courses = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.teacher', 'teacher')
      .leftJoinAndSelect('course.classroom', 'classroom')
      .leftJoinAndSelect('course.subject', 'subject')
      .where('course.status = :status', { status: status ?? Status.ACTIVO });

    for (const key in filter) {
      if (filter[key]) {
        courses = courses.andWhere(`course.${key} = :${key}`, {
          [key]: filter[key],
        });
      }
    }
    return courses.skip(offset).take(limit).getMany();
  }

  async findOne(id: string) {
    try {
      const course = await this.courseRepository.findOne({
        where: {
          id,
          status: Status.ACTIVO,
        },
        relations: [
          'subject',
          'teacher',
          'classroom',
          'students',
          'students.student',
        ],
      });
      if (!course) throw new NotFoundException('Course not found');
      return course;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const { hourPerWeek, teacher } = updateCourseDto;
      const course = await this.courseRepository.preload({
        id,
        ...(hourPerWeek && { hourPerWeek }),
        ...(teacher && { teacher: await this.teacherService.findOne(teacher) }),
      });
      await this.courseRepository.save(course);
      return course;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const course = await this.courseRepository.preload({
        id,
        status: Status.INACTIVO,
      });
      await this.courseRepository.save(course);
      return {
        status: 'OK',
        msg: 'Curso removido',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async assignStudents(insertStudentCourseDto: InsertStudentCourseDto) {
    try {
      const { students, course } = insertStudentCourseDto;
      const validateLengthStudents = true;
      const [curso, estudiantes] = await Promise.all([
        this.findOne(course),
        this.studentService.getStudents(students, validateLengthStudents),
      ]);
      const cursos = [curso];
      await this.studentCourseService.insertStudentCourse(cursos, estudiantes);
      return curso;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  getDifferentCourses(activeCourses: Course[], subjects: Subject[]): Subject[] {
    const differentCourses = [];
    subjects.forEach((subject) => {
      const curso = activeCourses.find((c) => c.subject.id === subject.id);
      if (!curso) differentCourses.push(subject);
    });
    return differentCourses;
  }

  async insertCourses(classroom: Classroom, subjects: Subject[]) {
    try {
      const courses = subjects.map((subject) => {
        const course = new Course();
        course.hourPerWeek = subject.hourPerWeek;
        course.classroom = classroom;
        course.subject = subject;
        return course;
      });
      await this.courseRepository
        .createQueryBuilder()
        .insert()
        .values(courses)
        .execute();
      return courses;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async createCourses(
    classroom: Classroom,
    subjects: Subject[],
    students: User[],
  ) {
    try {
      const { courses: activeCourses } = classroom;
      const differentCourses = this.getDifferentCourses(
        activeCourses,
        subjects,
      );
      const courses = await this.insertCourses(classroom, differentCourses);
      await this.studentCourseService.insertStudentCourse(courses, students);
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
