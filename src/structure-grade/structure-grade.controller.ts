import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StructureGradeService } from './structure-grade.service';
import { CreateStructureGradeDto } from './dto/create-structure-grade.dto';
import { UpdateStructureGradeDto } from './dto/update-structure-grade.dto';

@Controller('structure-grade')
export class StructureGradeController {
  constructor(private readonly structureGradeService: StructureGradeService) {}

  @Post()
  create(@Body() createStructureGradeDto: CreateStructureGradeDto) {
    return this.structureGradeService.create(createStructureGradeDto);
  }

  @Get()
  findAll() {
    return this.structureGradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.structureGradeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStructureGradeDto: UpdateStructureGradeDto,
  ) {
    return this.structureGradeService.update(+id, updateStructureGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.structureGradeService.remove(+id);
  }
}
