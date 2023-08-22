import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GradeController],
  providers: [GradeService],
  imports: [AuthModule, TypeOrmModule.forFeature([Grade])],
  exports: [GradeService],
})
export class GradeModule {}
