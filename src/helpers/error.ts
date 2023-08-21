import { InternalServerErrorException, Logger } from '@nestjs/common';

export function SendError(service: string, error) {
  const logger = new Logger(service);
  logger.error(error);
  if (error?.status !== 500) {
    throw error;
  } else {
    throw new InternalServerErrorException('Error');
  }
}
