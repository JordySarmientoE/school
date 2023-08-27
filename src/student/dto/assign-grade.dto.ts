import { IsUUID } from 'class-validator';

export class AssignGradeDto {
  @IsUUID('4')
  student: string;

  @IsUUID('4')
  grade: string;
}
