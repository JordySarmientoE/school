import { IsArray, IsUUID } from 'class-validator';

export class AssignStudentClassroomDto {
  @IsArray()
  @IsUUID('4', { each: true })
  students: string[];

  @IsUUID('4')
  classroom: string;
}
