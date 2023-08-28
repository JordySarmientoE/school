import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';
import { SendError } from 'src/helpers/error';
import { SearchClassroomDto } from './dto/search-classroom.dto';
import { Status } from 'src/constants/roles';
import { GradeService } from 'src/grade/grade.service';
import { StudentService } from 'src/student/student.service';
import { AssignStudentClassroomDto } from './dto/assign-student-classroom.dto';
import { User } from 'src/user/entities/user.entity';
import { AssignStructureDto } from './dto/assign-structure.dto';
import { AcademicStructureService } from 'src/academic-structure/academic-structure.service';
import { CourseService } from 'src/course/course.service';
import { StudentCourseService } from 'src/student-course/student-course.service';

@Injectable()
export class ClassroomService {
  private service = 'ClassroomService';

  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    private readonly gradeService: GradeService,
    private readonly studentService: StudentService,
    private readonly academicStructureService: AcademicStructureService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
    private readonly studentCourseService: StudentCourseService,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    try {
      const grade = await this.gradeService.findOne(createClassroomDto.grade);
      const classroom = this.classroomRepository.create({
        ...createClassroomDto,
        grade,
      });
      await this.classroomRepository.save(classroom);
      return classroom;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findAll(searchClassroomDto: SearchClassroomDto) {
    const {
      limit = 10,
      offset = 0,
      grade,
      status = Status.ACTIVO,
    } = searchClassroomDto;
    let classrooms = this.classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.grade', 'grade')
      .where('classroom.status = :status', { status });

    const busqueda = {
      grade,
      section: searchClassroomDto.section,
      year: searchClassroomDto.year,
      status: searchClassroomDto.status,
    };

    for (const key in busqueda) {
      if (busqueda[key]) {
        classrooms = classrooms.andWhere(`classroom.${key} = :${key}`, {
          [key]: busqueda[key],
        });
      }
    }

    classrooms = classrooms.skip(offset).take(limit);
    return classrooms.getMany();
  }

  async findOne(id: string) {
    try {
      const classroom = await this.classroomRepository.findOne({
        where: {
          id,
        },
        relations: [
          'grade',
          'students',
          'academicStructure',
          'courses',
          'courses.subject',
        ],
      });
      if (!classroom) throw new NotFoundException('Classroom not found');
      return classroom;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    try {
      const classroom = await this.classroomRepository.preload({
        id,
        ...updateClassroomDto,
        ...(updateClassroomDto.grade && {
          grade: await this.gradeService.findOne(updateClassroomDto.grade),
        }),
      });
      await this.classroomRepository.save(classroom);
      return classroom;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const classroom = await this.classroomRepository.preload({
        id,
        status: Status.INACTIVO,
      });
      await this.classroomRepository.save(classroom);
      return {
        status: 'OK',
        msg: 'Aula removida',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  concatenateUniqueStudents(students: User[], estudiantes: User[]) {
    estudiantes.forEach((curso) => {
      if (!students.find((subject) => subject.id === curso.id)) {
        students.push(curso);
      }
    });
    return students;
  }

  async assignStudents(assignStudentClassroomDto: AssignStudentClassroomDto) {
    const { students, classroom } = assignStudentClassroomDto;
    const validateLengthStudents = true;
    const [clase, estudiantes] = await Promise.all([
      this.findOne(classroom),
      this.studentService.getStudents(students, validateLengthStudents),
    ]);
    const studentHasClassroom = estudiantes.find(
      (student) => student.classroom && student.classroom.id !== classroom,
    );
    if (studentHasClassroom)
      throw new BadRequestException('Some student have a classroom active');
    const studentsDifferents = this.concatenateUniqueStudents(
      clase.students,
      estudiantes,
    );
    clase.students = studentsDifferents;
    const { courses } = clase;
    await this.classroomRepository.save(clase);
    if (courses.length > 0) {
      await this.studentCourseService.insertStudentCourse(courses, estudiantes);
    }
    return clase;
  }

  async assignAcademicStructure(assignStructureDto: AssignStructureDto) {
    const { academicStructure, grade, classroom } = assignStructureDto;
    const [clase, mallaCurricular] = await Promise.all([
      this.findOne(classroom),
      this.academicStructureService.findOneByGrade(academicStructure, grade),
    ]);
    clase.academicStructure = mallaCurricular;
    const { students } = clase;
    const { subject } = mallaCurricular.structureGrade[0];
    await this.classroomRepository.save(clase);
    if (subject.length > 0) {
      await this.courseService.createCourses(clase, subject, students);
    }
    return clase;
  }
}
