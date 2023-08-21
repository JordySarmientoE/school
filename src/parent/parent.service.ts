import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';
import { SendError } from 'src/helpers/error';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { TypeUsers } from 'src/constants/roles';
import { AssignStudentDto } from './dto/assign-student.dto';

@Injectable()
export class ParentService {
  private service = 'ParentService';
  private role = TypeUsers.PARENT;

  constructor(private readonly userService: UserService) {}

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
    if (!user) throw new NotFoundException('Parent not found');
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
        msg: 'Parent removido',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async assignStudent(assignStudentDto: AssignStudentDto) {
    const { student, parent } = assignStudentDto;
    return this.userService.assignStudent(student, parent);
  }
}
