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
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { SearchClassroomDto } from './dto/search-classroom.dto';
import { TypeUsers } from 'src/constants/roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AssignStudentClassroomDto } from './dto/assign-student-classroom.dto';
import { AssignStructureDto } from './dto/assign-structure.dto';

@Auth(TypeUsers.ADMIN)
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  findAll(@Query() searchClassroomDto: SearchClassroomDto) {
    return this.classroomService.findAll(searchClassroomDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomService.remove(id);
  }

  @Post('assign-students')
  assignStudents(@Body() assignStudentClassroomDto: AssignStudentClassroomDto) {
    return this.classroomService.assignStudents(assignStudentClassroomDto);
  }

  @Post('assign-structure')
  assignAcademicStructure(@Body() assignStructureDto: AssignStructureDto) {
    return this.classroomService.assignAcademicStructure(assignStructureDto);
  }
}
