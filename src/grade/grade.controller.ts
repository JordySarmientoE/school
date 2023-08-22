import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeUsers } from 'src/constants/roles';

@Auth(TypeUsers.ADMIN)
@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.gradeService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UUIDDto, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradeService.update(params.id, updateGradeDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.gradeService.remove(params.id);
  }
}
