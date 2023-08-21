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
import { TeacherService } from './teacher.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TypeUsers } from 'src/constants/roles';

@Auth(TypeUsers.ADMIN)
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() createUserDTO: CreateUserDto) {
    return this.teacherService.create(createUserDTO);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.teacherService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.teacherService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UUIDDto, @Body() updateUserDto: UpdateUserDto) {
    return this.teacherService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.teacherService.remove(params.id);
  }
}
