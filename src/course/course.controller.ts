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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { TypeUsers } from 'src/constants/roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UUIDDto } from 'src/helpers/dtos/uuid.dto';
import { SearchCourseDto } from './dto/search-course.dto';

//@Auth(TypeUsers.ADMIN)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll(@Query() searchCourseDto: SearchCourseDto) {
    return this.courseService.findAll(searchCourseDto);
  }

  @Get(':id')
  findOne(@Param() params: UUIDDto) {
    return this.courseService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: UUIDDto, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(params.id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param() params: UUIDDto) {
    return this.courseService.remove(params.id);
  }
}
