import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Status, TypeUsers } from 'src/constants/roles';
import { SendError } from 'src/helpers/error';
import { encrypt } from 'src/helpers/bcrypt';
import { PaginationDto } from 'src/helpers/dtos/pagination.dto';
import { SearchUser } from './interfaces/search-user';

@Injectable()
export class UserService {
  private service = 'UserService';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    role: TypeUsers = TypeUsers.STUDENT,
  ) {
    try {
      createUserDto.email = createUserDto.email.toLowerCase().trim();
      const userByEmail = await this.getByEmail(createUserDto.email);
      if (userByEmail) throw new BadRequestException('Email was taken');
      const password = await encrypt(createUserDto.password);
      createUserDto.password = password;
      const user = this.userRepository.create({ ...createUserDto, role });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await encrypt(updateUserDto.password);
      }

      const user = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });

      if (!user) throw new NotFoundException('User Not Found');

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.preload({
        id,
        status: Status.INACTIVO,
      });

      if (!user) throw new NotFoundException('User Not Found');

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async getByEmail(email: string) {
    try {
      const emailFormatted = email.toLowerCase().trim();
      const user = await this.userRepository.findOne({
        where: {
          email: emailFormatted,
          status: Status.ACTIVO,
        },
        select: {
          email: true,
          password: true,
          id: true,
        },
      });
      return user;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async findAll(paginationDto: PaginationDto, role?: TypeUsers) {
    const { limit = 10, offset = 0 } = paginationDto;
    const where: SearchUser = {
      status: Status.ACTIVO,
    };
    if (role) {
      where.role = role;
    }
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
      where,
    });
    return users;
  }

  async findOne(id: string, role?: TypeUsers) {
    const where: any = {
      status: Status.ACTIVO,
      id,
    };
    if (role) {
      where.role = role;
    }
    const user = await this.userRepository.findOne({
      where,
      relations: ['children'],
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async assignStudent(student: string, parent: string) {
    const estudiante = await this.findOne(student, TypeUsers.STUDENT);
    const padre = await this.findOne(parent, TypeUsers.PARENT);
    const asignacion = await this.userRepository.preload({
      id: parent,
      children: estudiante,
    });
    await this.userRepository.save(asignacion);
    return padre;
  }
}
