import { Module } from '@nestjs/common';
import { StructureGradeService } from './structure-grade.service';
import { StructureGradeController } from './structure-grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructureGrade } from './entities/structure-grade.entity';
import { SubjectModule } from 'src/subject/subject.module';
import { AcademicStructureModule } from 'src/academic-structure/academic-structure.module';
import { GradeModule } from 'src/grade/grade.module';

@Module({
  controllers: [StructureGradeController],
  providers: [StructureGradeService],
  imports: [
    TypeOrmModule.forFeature([StructureGrade]),
    SubjectModule,
    AcademicStructureModule,
    GradeModule,
  ],
})
export class StructureGradeModule {}
