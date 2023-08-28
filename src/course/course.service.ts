import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class CourseService {
  private service = 'CourseService';
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly classroomService: ClassroomService,
    private readonly teacherService: TeacherService,
    private readonly subjectService: SubjectService,
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
      const course = this.courseRepository.create({
        hourPerWeek,
        subject: materia,
        ...(teacher && { teacher: profesor }),
        ...(classroom && { classroom: salon }),
      });
      await this.courseRepository.save(course);
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
        relations: ['subject', 'teacher', 'classroom', 'students'],
      });
      if (!course) throw new NotFoundException('Course not found');
      return course;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const { hourPerWeek, classroom, teacher } = updateCourseDto;
      const course = await this.courseRepository.preload({
        id,
        ...(hourPerWeek && { hourPerWeek }),
        ...(classroom && {
          classroom: await this.classroomService.findOne(classroom),
        }),
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
}
