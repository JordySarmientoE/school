import { IsArray, IsUUID } from 'class-validator';

export class AddSubjectToStructureDto {
  @IsArray()
  @IsUUID('4', { each: true })
  subjects: string[];

  @IsUUID('4')
  structure: string;

  @IsUUID('4')
  grade: string;
}
