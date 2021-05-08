import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    // const taskIndex = this.tasks.findIndex((task) => task.id === id);
    // if (taskIndex >= 0) this.tasks[taskIndex].status = status;
    // return this.tasks[taskIndex];
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) throw new NotFoundException(`Task with ID: ${id} not found`);

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    /* TODO NOT GOOD ON PERFORMANCE
    const found = await this.getTaskById(id);
    await this.taskRepository.deleteTask(found);
     */
    const results = await this.taskRepository.delete({ id, userId: user.id });

    if (0 === results.affected)
      throw new NotFoundException(`Task with ID: ${id} not found`);
  }
}
