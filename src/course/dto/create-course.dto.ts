import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @IsOptional()
  @IsUUID('4')
  classroom?: string;

  @IsOptional()
  @IsUUID('4')
  teacher?: string;

  @IsNumber()
  hourPerWeek: number;

  @IsUUID('4')
  subject: string;
}
