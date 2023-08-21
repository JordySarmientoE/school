import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicStructureDto } from './dto/create-academic-structure.dto';
import { UpdateAcademicStructureDto } from './dto/update-academic-structure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicStructure } from './entities/academic-structure.entity';
import { SendError } from 'src/helpers/error';
import { Status } from 'src/constants/roles';
import { SubjectService } from 'src/subject/subject.service';
import { AddSubjectToStructureDto } from './dto/add-subject-to-structure.dto';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';

@Injectable()
export class AcademicStructureService {
  private service = 'UserService';

  constructor(
    @InjectRepository(AcademicStructure)
    private readonly academicRepository: Repository<AcademicStructure>,
    private readonly subjectService: SubjectService,
  ) {}

  async create(createAcademicStructureDto: CreateAcademicStructureDto) {
    try {
      const academicStruc = this.academicRepository.create(
        createAcademicStructureDto,
      );
      await this.academicRepository.save(academicStruc);
      return academicStruc;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.academicRepository.find({
      skip: offset,
      take: limit,
      where: {
        status: Status.ACTIVO,
      },
    });
  }

  async findOne(id: string) {
    try {
      const academicStruc = await this.academicRepository.findOne({
        where: {
          status: Status.ACTIVO,
          id,
        },
        relations: ['subject'],
      });
      if (!academicStruc) throw new NotFoundException('Malla not found');
      return academicStruc;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(
    id: string,
    updateAcademicStructureDto: UpdateAcademicStructureDto,
  ) {
    try {
      const academicStruc = await this.academicRepository.preload({
        id,
        ...updateAcademicStructureDto,
      });
      if (!academicStruc) throw new NotFoundException('Malla not found');
      await this.academicRepository.save(academicStruc);
      return academicStruc;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const academicStruc = await this.academicRepository.preload({
        id,
        status: Status.INACTIVO,
      });
      if (!academicStruc) throw new NotFoundException('Malla not found');
      await this.academicRepository.save(academicStruc);
      return {
        status: 'OK',
        msg: 'Malla curricular removida',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async addSubjectsToStructure(
    addSubjectToStructureDto: AddSubjectToStructureDto,
  ) {
    try {
      const { structure, subject } = addSubjectToStructureDto;
      const subjectObject = await this.subjectService.findOne(subject);
      const structureObject = await this.findOne(structure);
      structureObject.subject.push(subjectObject);
      await this.academicRepository.save(structureObject);
      return structureObject;
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
