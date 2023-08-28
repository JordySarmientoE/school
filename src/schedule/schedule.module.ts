import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [AuthModule],
})
export class ScheduleModule {}
