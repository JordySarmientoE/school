import { IsUUID } from 'class-validator';

export class AssignStudentDto {
  @IsUUID('4')
  student: string;

  @IsUUID('4')
  parent: string;
}
