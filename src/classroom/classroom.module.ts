import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { GradeModule } from 'src/grade/grade.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Classroom]),
    GradeModule,
    StudentModule,
  ],
})
export class ClassroomModule {}
