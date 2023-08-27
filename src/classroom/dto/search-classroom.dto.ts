import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsIn, IsUUID } from 'class-validator';
import { Status } from 'src/constants/roles';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';

export class SearchClassroomDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4')
  grade?: string;

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
