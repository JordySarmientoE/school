import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { Repository } from 'typeorm';
import { SendError } from 'src/helpers/error';
import { Status } from 'src/constants/roles';

@Injectable()
export class GradeService {
  private service = 'GradeService';

  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  async create(createGradeDto: CreateGradeDto) {
    try {
      const grade = this.gradeRepository.create(createGradeDto);
      await this.gradeRepository.save(grade);
      return grade;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findAll() {
    return this.gradeRepository.find({
      where: {
        status: Status.ACTIVO,
      },
    });
  }

  async findOne(id: string) {
    try {
      const grade = await this.gradeRepository.findOne({
        where: {
          id,
        },
      });
      if (!grade) throw new NotFoundException('Grade not found');
      return grade;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateGradeDto: UpdateGradeDto) {
    try {
      const grade = await this.gradeRepository.preload({
        id,
        ...updateGradeDto,
      });
      if (!grade) throw new NotFoundException('Grade not found');
      await this.gradeRepository.save(grade);
      return grade;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const grade = await this.gradeRepository.preload({
        id,
        status: Status.INACTIVO,
      });
      if (!grade) throw new NotFoundException('Grade not found');
      await this.gradeRepository.save(grade);
      return grade;
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
