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

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Auth(TypeUsers.ADMIN)
  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Auth(TypeUsers.ADMIN)
  @Get()
  findAll(@Query() searchClassroomDto: SearchClassroomDto) {
    return this.classroomService.findAll(searchClassroomDto);
  }

  @Auth(TypeUsers.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(id);
  }

  @Auth(TypeUsers.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.update(id, updateClassroomDto);
  }

  @Auth(TypeUsers.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classroomService.remove(id);
  }
}
