import { IsEnum, IsString, IsUUID, Validate } from 'class-validator';
import { DayOfWeek } from 'src/constants/dayOfWeek';
import { IsTimeFormatConstraint } from 'src/helpers/validators/time.validator';

export class CreateScheduleDto {
  @IsUUID('4')
  course: string;

  @IsString()
  @Validate(IsTimeFormatConstraint)
  start_time: string;

  @IsString()
  @Validate(IsTimeFormatConstraint)
  end_time: string;

  @IsEnum(DayOfWeek, { message: 'day: Day of Week is invalid' })
  day: string;
}
