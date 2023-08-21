import { Module } from '@nestjs/common';
import { AcademicStructureService } from './academic-structure.service';
import { AcademicStructureController } from './academic-structure.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicStructure } from './entities/academic-structure.entity';
import { SubjectModule } from 'src/subject/subject.module';

@Module({
  controllers: [AcademicStructureController],
  providers: [AcademicStructureService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([AcademicStructure]),
    SubjectModule,
  ],
})
export class AcademicStructureModule {}
