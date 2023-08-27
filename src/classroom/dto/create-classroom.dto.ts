import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateClassroomDto {
  @IsUUID('4')
  grade: string;

  @IsString()
  section: string;

  @IsNumber()
  year: number;
}
