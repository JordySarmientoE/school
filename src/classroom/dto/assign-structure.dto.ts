import { IsUUID } from 'class-validator';

export class AssignStructureDto {
  @IsUUID('4')
  academicStructure: string;

  @IsUUID('4')
  grade: string;

  @IsUUID('4')
  classroom: string;
}
