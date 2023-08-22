import { Injectable } from '@nestjs/common';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';
import { SendError } from 'src/helpers/error';
import { SearchClassroom } from './interfaces/search-classroom';
import { SearchClassroomDto } from './dto/search-classroom.dto';
import { Status } from 'src/constants/roles';

@Injectable()
export class ClassroomService {
  private service = 'ClassroomService';

  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async create(createClassroomDto: CreateClassroomDto) {
    try {
      const classroom = this.classroomRepository.create(createClassroomDto);
      await this.classroomRepository.save(classroom);
      return classroom;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  findAll(searchClassroomDto: SearchClassroomDto) {
    const { limit, offset, grade, section, year } = searchClassroomDto;
    const where: SearchClassroom = {};
    Object.assign(where, { grade, section, year });
    const options: any = {
      skip: offset,
      take: limit,
    };
    if (Object.values(where).filter((val) => val).length > 0) {
      options.where = where;
    }
    return this.classroomRepository.find({
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    try {
      return this.classroomRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    try {
      const classroom = await this.classroomRepository.preload({
        id,
        ...updateClassroomDto,
      });
      await this.classroomRepository.save(classroom);
      return classroom;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const classroom = await this.classroomRepository.preload({
        id,
        status: Status.INACTIVO,
      });
      await this.classroomRepository.save(classroom);
      return {
        status: 'OK',
        msg: 'Aula removida',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
