import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities/classroom.entity';
import { GradeModule } from 'src/grade/grade.module';
import { StudentModule } from 'src/student/student.module';
import { StructureGradeModule } from 'src/structure-grade/structure-grade.module';
import { AcademicStructureModule } from 'src/academic-structure/academic-structure.module';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Classroom]),
    GradeModule,
    StudentModule,
    StructureGradeModule,
    AcademicStructureModule,
  ],
  exports: [ClassroomService],
})
export class ClassroomModule {}
