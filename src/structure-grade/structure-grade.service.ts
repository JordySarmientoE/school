import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStructureGradeDto } from './dto/create-structure-grade.dto';
import { AddSubjectToStructureDto } from './dto/add-subject-to-structure.dto';
import { SendError } from 'src/helpers/error';
import { SubjectService } from 'src/subject/subject.service';
import { StructureGrade } from './entities/structure-grade.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicStructureService } from 'src/academic-structure/academic-structure.service';
import { GradeService } from 'src/grade/grade.service';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { Status } from 'src/constants/roles';
import { Subject } from 'src/subject/entities/subject.entity';

@Injectable()
export class StructureGradeService {
  private service = 'StructureGradeService';
  constructor(
    @InjectRepository(StructureGrade)
    private readonly academicRepository: Repository<StructureGrade>,
    private readonly subjectService: SubjectService,
    private readonly academicStructureService: AcademicStructureService,
    private readonly gradeService: GradeService,
  ) {}

  async create(createStructureGradeDto: CreateStructureGradeDto) {
    try {
      const { grade, academicStructure } = createStructureGradeDto;
      const [mallaCurricular, grado] = await Promise.all([
        this.academicStructureService.findOne(academicStructure),
        this.gradeService.findOne(grade),
      ]);
      const structureGrade = this.academicRepository.create({
        grade: grado,
        academicStructure: mallaCurricular,
      });
      await this.academicRepository.save(structureGrade);
      return structureGrade;
    } catch (error) {
      SendError(this.service, error);
    }
    return 'This action adds a new structureGrade';
  }

  findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return this.academicRepository.find({
        skip: offset,
        take: limit,
        where: {
          status: Status.ACTIVO,
        },
        relations: ['academicStructure', 'grade'],
      });
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findOne(id: string) {
    try {
      const structureGrade = await this.academicRepository.findOne({
        where: {
          status: Status.ACTIVO,
          id,
        },
        relations: ['academicStructure', 'grade', 'subject'],
      });
      if (!structureGrade)
        throw new NotFoundException('Malla curricular grado not found');
      return structureGrade;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const structureGrade = await this.academicRepository.preload({
        id,
        status: Status.INACTIVO,
      });
      if (!structureGrade)
        throw new NotFoundException('Malla curricular grado not found');
      await this.academicRepository.save(structureGrade);
      return structureGrade;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findOneByGrade(grade: string, academicStructure: string) {
    try {
      const structureGrade = await this.academicRepository
        .createQueryBuilder('structureGrade')
        .leftJoinAndSelect('structureGrade.subject', 'subject')
        .where('structureGrade.grade.id = :gradeId', { gradeId: grade })
        .andWhere('structureGrade.status = :status', { status: Status.ACTIVO })
        .andWhere('structureGrade.academicStructure.id = :academicStructure', {
          academicStructure: academicStructure,
        })
        .getOne();
      if (!structureGrade)
        throw new NotFoundException('Malla curricular grado not found');
      return structureGrade;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  concatenateUniqueSubjects(subjects: Subject[], cursos: Subject[]) {
    cursos.forEach((curso) => {
      if (!subjects.find((subject) => subject.id === curso.id)) {
        subjects.push(curso);
      }
    });
    return subjects;
  }

  async addSubjectsToStructure(
    addSubjectToStructureDto: AddSubjectToStructureDto,
  ) {
    try {
      const { subjects, structure, grade } = addSubjectToStructureDto;
      const validateLengthCurses = true;
      const [cursos, structureGrade] = await Promise.all([
        this.subjectService.getSubjects(subjects, validateLengthCurses),
        this.findOneByGrade(grade, structure),
      ]);
      const cursosDiferentes = this.concatenateUniqueSubjects(
        structureGrade.subject,
        cursos,
      );
      structureGrade.subject = cursosDiferentes;
      await this.academicRepository.save(structureGrade);
      return structureGrade;
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
