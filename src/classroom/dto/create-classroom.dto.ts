import { IsString, IsNumber } from 'class-validator';

export class CreateClassroomDto {
  @IsNumber()
  grade: number;

  @IsString()
  section: string;

  @IsNumber()
  year: number;
}
