import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { SendError } from 'src/helpers/error';
import { Status } from 'src/constants/roles';

@Injectable()
export class SubjectService {
  private service = 'UserService';

  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      createSubjectDto.name = createSubjectDto.name.toUpperCase().trim();
      const subjectByName = await this.getByName(createSubjectDto.name);
      if (subjectByName) throw new BadRequestException('Name was taken');
      const user = this.subjectRepository.create(createSubjectDto);
      await this.subjectRepository.save(user);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async getByName(name: string) {
    try {
      const user = await this.subjectRepository.findOne({
        where: {
          name,
          status: Status.ACTIVO,
        },
      });
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findAll() {
    try {
      return this.subjectRepository.find({
        where: {
          status: Status.ACTIVO,
        },
      });
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findOne(id: string) {
    try {
      const subject = await this.subjectRepository.findOne({
        where: {
          status: Status.ACTIVO,
          id,
        },
      });
      if (!subject) throw new NotFoundException('Subject Not Found');
      return subject;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    try {
      const subject = await this.subjectRepository.preload({
        id,
        ...updateSubjectDto,
      });

      if (!subject) throw new NotFoundException('Subject Not Found');

      await this.subjectRepository.save(subject);
      return subject;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const subject = await this.subjectRepository.preload({
        id,
        status: Status.INACTIVO,
      });

      if (!subject) throw new NotFoundException('Subject Not Found');
      await this.subjectRepository.save(subject);
      return {
        status: 'OK',
        msg: 'Materia removida',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
