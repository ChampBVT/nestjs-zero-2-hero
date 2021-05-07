import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}
  // private tasks: Task[] = [];
  //
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTaskWithFilter(filterTaskDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterTaskDto;
  //
  //   let tasks = this.getAllTasks();
  //
  //   if (status) tasks = tasks.filter((task) => task.status === status);
  //   if (search) {
  //     tasks = tasks.filter(
  //       (tasks) =>
  //         tasks.title.includes(search) || tasks.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
  //

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    // const taskIndex = this.tasks.findIndex((task) => task.id === id);
    // if (taskIndex >= 0) this.tasks[taskIndex].status = status;
    // return this.tasks[taskIndex];
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) throw new NotFoundException(`Task with ID: ${id} not found`);

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number): Promise<void> {
    /* TODO NOT GOOD ON PERFORMANCE
    const found = await this.getTaskById(id);
    await this.taskRepository.deleteTask(found);
     */
    const results = await this.taskRepository.delete(id);

    if (0 === results.affected)
      throw new NotFoundException(`Task with ID: ${id} not found`);
  }
}
