import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { Status } from 'src/constants/roles';
import { CourseService } from 'src/course/course.service';
import { SendError } from 'src/helpers/error';
import {
  compareScheduleHours,
  getHours,
  validateHours,
} from 'src/helpers/functions/compare-hours.function';

@Injectable()
export class ScheduleService {
  private readonly service = 'ScheduleService';
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly courseService: CourseService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    try {
      const { course, start_time, end_time, day } = createScheduleDto;
      const curso = await this.courseService.findOne(course);
      const { schedules, hourPerWeek } = curso;
      const { isValid } = validateHours(start_time, end_time);
      if (!isValid)
        throw new BadRequestException('End time cannot be major to Start time');
      const schedule = this.scheduleRepository.create({
        start_time,
        end_time,
        course: curso,
        day,
      });
      schedules.push(schedule);
      const { hours, minutes } = getHours(schedules);
      const validHoursSchedule = compareScheduleHours(
        hours,
        minutes,
        hourPerWeek,
      );
      if (!validHoursSchedule)
        throw new BadRequestException('Too much hours for the course');
      await this.scheduleRepository.save(schedule);
      curso.schedules.push(schedule);
      return curso;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  findAll() {
    return this.scheduleRepository.find({
      where: {
        status: Status.ACTIVO,
      },
      relations: ['course'],
    });
  }

  async findOne(id: string) {
    try {
      return this.scheduleRepository.findOne({
        where: {
          id,
        },
        relations: ['course', 'course.schedules'],
      });
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    try {
      const { start_time, end_time, day } = updateScheduleDto;
      const schedule = await this.findOne(id);
      if (day) schedule.day = day;
      const { schedules, hourPerWeek } = schedule.course;
      if (start_time || end_time) {
        const startTime = start_time ?? schedule.start_time;
        const endTime = end_time ?? schedule.end_time;
        const { isValid } = validateHours(startTime, endTime);
        if (!isValid)
          throw new BadRequestException(
            'End time cannot be major to Start time',
          );
        const differentSchedules = schedules.filter(
          (sch) => sch.id !== schedule.id,
        );
        schedule.start_time = startTime;
        schedule.end_time = endTime;
        differentSchedules.push(schedule);
        const { hours, minutes } = getHours(differentSchedules);
        const validHoursSchedule = compareScheduleHours(
          hours,
          minutes,
          hourPerWeek,
        );
        if (!validHoursSchedule)
          throw new BadRequestException('Too much hours for the course');
      }
      await this.scheduleRepository.save(schedule);
      return schedule;
    } catch (error) {
      SendError(this.service, error);
    }
  }

  async remove(id: string) {
    try {
      const schedule = await this.scheduleRepository.preload({
        id,
        status: Status.ACTIVO,
      });
      await this.scheduleRepository.save(schedule);
      return {
        status: 'OK',
        msg: 'Schedule removido',
      };
    } catch (error) {
      SendError(this.service, error);
    }
  }
}
