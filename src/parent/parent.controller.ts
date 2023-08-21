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
import { ParentService } from './parent.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { AssignStudentDto } from './dto/assign-student.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeUsers } from 'src/constants/roles';

@Auth(TypeUsers.ADMIN)
@Controller('parent')
export class TeacherController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDto) {
    return this.parentService.create(createUserDTO);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.parentService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.parentService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UUIDDto, @Body() updateUserDto: UpdateUserDto) {
    return this.parentService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.parentService.remove(params.id);
  }

  @Post('assign-student')
  assignStudent(@Body() assignStudentDto: AssignStudentDto) {
    return this.parentService.assignStudent(assignStudentDto);
  }
}
