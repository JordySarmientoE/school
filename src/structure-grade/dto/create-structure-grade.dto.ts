import { IsUUID } from 'class-validator';

export class CreateStructureGradeDto {
  @IsUUID('4')
  grade: string;

  @IsUUID('4')
  academicStructure: string;
}
