import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService],
  imports: [AuthModule, TypeOrmModule.forFeature([Classroom])],
})
export class ClassroomModule {}
