import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AcademicStructureService } from './academic-structure.service';
import { CreateAcademicStructureDto } from './dto/create-academic-structure.dto';
import { UpdateAcademicStructureDto } from './dto/update-academic-structure.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeUsers } from 'src/constants/roles';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';

@Auth(TypeUsers.ADMIN)
@Controller('academic-structure')
export class AcademicStructureController {
  constructor(
    private readonly academicStructureService: AcademicStructureService,
  ) {}

  @Post()
  create(@Body() createAcademicStructureDto: CreateAcademicStructureDto) {
    return this.academicStructureService.create(createAcademicStructureDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.academicStructureService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.academicStructureService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: UUIDDto,
    @Body() updateAcademicStructureDto: UpdateAcademicStructureDto,
  ) {
    return this.academicStructureService.update(
      params.id,
      updateAcademicStructureDto,
    );
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.academicStructureService.remove(params.id);
  }
}
