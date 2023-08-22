import { Module } from '@nestjs/common';
import { StructureGradeService } from './structure-grade.service';
import { StructureGradeController } from './structure-grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructureGrade } from './entities/structure-grade.entity';

@Module({
  controllers: [StructureGradeController],
  providers: [StructureGradeService],
  imports: [TypeOrmModule.forFeature([StructureGrade])],
})
export class StructureGradeModule {}
