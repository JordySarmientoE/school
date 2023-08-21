import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicStructureDto } from './create-academic-structure.dto';

export class UpdateAcademicStructureDto extends PartialType(
  CreateAcademicStructureDto,
) {}
