import { IsString, IsNumber } from 'class-validator';

export class CreateAcademicStructureDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;
}
