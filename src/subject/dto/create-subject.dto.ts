import { IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsNumber()
  hourPerWeek: number;
}
