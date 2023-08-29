import { Schedule } from 'src/schedule/entities/schedule.entity';

export function validateHours(start_time: string, end_time: string) {
  const startTime = new Date(`1970-01-01T${start_time}`);
  const endTime = new Date(`1970-01-01T${end_time}`);
  const isValid = end_time >= start_time;
  const diffInMillis = endTime.getTime() - startTime.getTime();
  const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return {
    isValid,
    minutes,
    hours,
  };
}

export function getHours(schedules: Schedule[]) {
  const horarios = schedules.map((schedule) => {
    const { start_time, end_time } = schedule;
    const startTime = new Date(`1970-01-01T${start_time}`);
    const endTime = new Date(`1970-01-01T${end_time}`);
    return {
      start_time: startTime,
      end_time: endTime,
      difference: endTime.getTime() - startTime.getTime(),
    };
  });
  const sumaHorarios = horarios.reduce(
    (previous, current) => previous + current.difference,
    0,
  );
  const diffInMinutes = Math.floor(sumaHorarios / (1000 * 60));
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return {
    minutes,
    hours,
  };
}

export function compareScheduleHours(
  hours: number,
  minutes: number,
  hourPerWeek: number,
) {
  const hoursToMinutes = hours * 60;
  const validateHours = hoursToMinutes + minutes;
  const entero = Math.floor(hourPerWeek);
  const decimal = hourPerWeek % 1;
  const total = (entero + decimal) * 60;
  return total >= validateHours;
}
