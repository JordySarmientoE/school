import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';
import { SendError } from 'src/helpers/error';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { TypeUsers } from 'src/constants/roles';
import { AssignGradeDto } from './dto/assign-grade.dto';
import { GradeService } from 'src/grade/grade.service';

@Injectable()
export class StudentService {
  private service = 'StudentService';
  private role = TypeUsers.STUDENT;

  constructor(
    private readonly userService: UserService,
    private readonly gradeService: GradeService,
  ) {}

  async create(createUserDTO: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDTO, this.role);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto, this.role);
  }

  async findOne(id: string) {
    const user = await this.userService.findOne(id, this.role);
    if (!user) throw new NotFoundException('Student not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      await this.userService.remove(id);
      return {
        status: 'OK',
        msg: 'Student removido',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async assignGrade(assignGradeDto: AssignGradeDto) {
    try {
      const { student, grade } = assignGradeDto;
      const estudiante = await this.findOne(student);
      if (!(estudiante.role === TypeUsers.STUDENT))
        throw new BadRequestException('Only Students Can Have Grade');
      const grado = await this.gradeService.findOne(grade);
      const user = await this.userService.assignGrade(student, grado);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async getStudents(ids: string[], validateLength = false) {
    try {
      const students = await this.userService.getStudents(ids);
      if (validateLength && ids.length !== students.length)
        throw new BadRequestException('Some students not found');
      return students;
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
