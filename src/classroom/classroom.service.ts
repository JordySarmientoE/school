import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { StructureGradeService } from 'src/structure-grade/structure-grade.service';
import { AcademicStructureService } from 'src/academic-structure/academic-structure.service';

@Injectable()
export class ClassroomService {
  private service = 'ClassroomService';

  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    private readonly gradeService: GradeService,
    private readonly studentService: StudentService,
    private readonly structureGradeService: StructureGradeService,
    private readonly academicStructureService: AcademicStructureService,
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
    const { limit = 10, offset = 0, grade } = searchClassroomDto;
    let isFirstWhere = true;
    const busqueda = {
      grade,
      section: searchClassroomDto.section,
      year: searchClassroomDto.year,
      status: searchClassroomDto.status,
    };
    let classrooms = this.classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.grade', 'grade');

    for (const key in busqueda) {
      if (busqueda[key]) {
        let grado = undefined;
        if (key === 'grade') {
          grado = await this.gradeService.findOne(grade);
        }
        const queryWhere = isFirstWhere ? 'where' : 'andWhere';
        classrooms = classrooms[queryWhere](`classroom.${key} = :${key}`, {
          [key]: grado ? grado.id : busqueda[key],
        });
        isFirstWhere = false;
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
        relations: ['grade', 'students', 'academicStructure'],
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
    const clase = await this.findOne(classroom);
    const validateLengthStudents = true;
    const estudiantes = await this.studentService.getStudents(
      students,
      validateLengthStudents,
    );
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
    // TODO: Se debe insertar los cursos a los estudiantes
    await this.classroomRepository.save(clase);
    return clase;
  }

  async assignAcademicStructure(assignStructureDto: AssignStructureDto) {
    const { academicStructure, grade, classroom } = assignStructureDto;
    const [mallaCurricular, grado] = await Promise.all([
      this.academicStructureService.findOne(academicStructure),
      this.gradeService.findOne(grade),
    ]);
    const [classroomStructure, structureGrade] = await Promise.all([
      this.classroomRepository.preload({
        id: classroom,
        academicStructure: mallaCurricular,
      }),
      this.structureGradeService.findOneByGrade(grado, mallaCurricular),
    ]);
    // TODO: Se tiene structureGrade para obtener los subject para insertar con course
    await this.classroomRepository.save(classroomStructure);
    return classroomStructure;
  }
}
