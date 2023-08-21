import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService],
  imports: [TypeOrmModule.forFeature([Subject]), AuthModule],
  exports: [SubjectService],
})
export class SubjectModule {}
