import { IsArray, IsUUID } from 'class-validator';

export class InsertStudentCourseDto {
  @IsArray()
  @IsUUID('4', { each: true })
  students: string[];

  @IsUUID('4')
  course: string;
}
