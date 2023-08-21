import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { Status } from 'src/constants/roles';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';

export class SearchClassroomDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  grade?: number;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsString()
  @IsIn([Status.ACTIVO, Status.INACTIVO])
  status: string;
}
