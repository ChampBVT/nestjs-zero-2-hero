import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isValidStatus(value))
      throw new BadRequestException(`${value} is not a valid Task status`);

    return value;
  }

  private isValidStatus(status: any) {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
}
