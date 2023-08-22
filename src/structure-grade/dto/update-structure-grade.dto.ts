import { PartialType } from '@nestjs/mapped-types';
import { CreateStructureGradeDto } from './create-structure-grade.dto';

export class UpdateStructureGradeDto extends PartialType(CreateStructureGradeDto) {}
