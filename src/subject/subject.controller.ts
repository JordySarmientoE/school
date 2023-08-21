import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeUsers } from 'src/constants/roles';

@Auth(TypeUsers.ADMIN)
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.subjectService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UUIDDto, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectService.update(params.id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.subjectService.remove(params.id);
  }
}
