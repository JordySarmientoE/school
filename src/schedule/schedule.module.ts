import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { CourseModule } from 'src/course/course.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [AuthModule, TypeOrmModule.forFeature([Schedule]), CourseModule],
})
export class ScheduleModule {}
