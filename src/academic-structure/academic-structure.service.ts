import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicStructureDto } from './dto/create-academic-structure.dto';
import { UpdateAcademicStructureDto } from './dto/update-academic-structure.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicStructure } from './entities/academic-structure.entity';
import { SendError } from 'src/helpers/error';
import { Status } from 'src/constants/roles';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';

@Injectable()
export class AcademicStructureService {
  private service = 'AcademicStructureService';

  constructor(
    @InjectRepository(AcademicStructure)
    private readonly academicRepository: Repository<AcademicStructure>,
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
        relations: [
          'structureGrade',
          'structureGrade.subject',
          'structureGrade.grade',
        ],
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

  async findOneByGrade(structure: string, grade: string) {
    try {
      const academicStructure = await this.academicRepository
        .createQueryBuilder('structure')
        .leftJoinAndSelect('structure.structureGrade', 'structureGrade')
        .leftJoinAndSelect('structureGrade.subject', 'subject')
        .where('structure.status = :status', { status: Status.ACTIVO })
        .andWhere('structureGrade.status = :status', { status: Status.ACTIVO })
        .andWhere('structureGrade.grade.id = :grade', { grade })
        .andWhere('structure.id = :structure', { structure })
        .getOne();
      if (academicStructure.structureGrade.length < 0)
        throw new NotFoundException('Grado malla curricular not found');
      return academicStructure;
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
