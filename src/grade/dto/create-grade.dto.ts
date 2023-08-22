import { IsNumber } from 'class-validator';

export class CreateGradeDto {
  @IsNumber()
  grade: number;
}
