import { IsString, IsOptional, IsIn, IsUUID } from 'class-validator';
import { Status } from 'src/constants/roles';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';

export class SearchCourseDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4')
  teacher?: string;

  @IsOptional()
  @IsUUID('4')
  subject?: string;

  @IsOptional()
  @IsUUID('4')
  classroom?: string;

  @IsOptional()
  @IsString()
  @IsIn([Status.ACTIVO, Status.INACTIVO])
  status: string;
}
