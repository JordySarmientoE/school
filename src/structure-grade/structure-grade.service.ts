import { Injectable } from '@nestjs/common';
import { CreateStructureGradeDto } from './dto/create-structure-grade.dto';
import { UpdateStructureGradeDto } from './dto/update-structure-grade.dto';

@Injectable()
export class StructureGradeService {
  create(createStructureGradeDto: CreateStructureGradeDto) {
    return 'This action adds a new structureGrade';
  }

  findAll() {
    return `This action returns all structureGrade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} structureGrade`;
  }

  update(id: number, updateStructureGradeDto: UpdateStructureGradeDto) {
    return `This action updates a #${id} structureGrade`;
  }

  remove(id: number) {
    return `This action removes a #${id} structureGrade`;
  }
}
