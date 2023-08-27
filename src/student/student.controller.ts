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
import { StudentService } from './student.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeUsers } from 'src/constants/roles';
import { AssignGradeDto } from './dto/assign-grade.dto';

@Auth(TypeUsers.ADMIN)
@Controller('student')
export class TeacherController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDto) {
    return this.studentService.create(createUserDTO);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.studentService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UUIDDto, @Body() updateUserDto: UpdateUserDto) {
    return this.studentService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.studentService.remove(params.id);
  }

  @Post('assign-grade')
  assignGrade(@Body() assignGradeDto: AssignGradeDto) {
    return this.studentService.assignGrade(assignGradeDto);
  }
}
