import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StructureGradeService } from './structure-grade.service';
import { CreateStructureGradeDto } from './dto/create-structure-grade.dto';
import { AddSubjectToStructureDto } from './dto/add-subject-to-structure.dto';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { TypeUsers } from 'src/constants/roles';
import { Auth } from 'src/auth/decorators/auth.decorator';

//@Auth(TypeUsers.ADMIN)
@Controller('structure-grade')
export class StructureGradeController {
  constructor(private readonly structureGradeService: StructureGradeService) {}

  @Post()
  create(@Body() createStructureGradeDto: CreateStructureGradeDto) {
    return this.structureGradeService.create(createStructureGradeDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.structureGradeService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.structureGradeService.findOne(params.id);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.structureGradeService.remove(params.id);
  }

  @Post('add-subject')
  addSubjectsToStructure(
    @Body() addSubjectToStructureDto: AddSubjectToStructureDto,
  ) {
    return this.structureGradeService.addSubjectsToStructure(
      addSubjectToStructureDto,
    );
  }
}
