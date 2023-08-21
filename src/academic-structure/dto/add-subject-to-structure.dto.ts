import { IsUUID } from 'class-validator';

export class AddSubjectToStructureDto {
  @IsUUID('4')
  subject: string;

  @IsUUID('4')
  structure: string;
}
