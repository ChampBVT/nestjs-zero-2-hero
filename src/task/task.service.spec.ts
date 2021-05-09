import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';

const mockUser = { id: 1, username: 'Test' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('TaskService', () => {
  let taskService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = await module.get<TaskService>(TaskService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('Get all tasks from repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const dto: GetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some query',
      };

      const result = await taskService.getTasks(dto, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('Get task by Id', () => {
    it('Call taskRepository.findOne() and return task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
      };
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById(1, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(result).toEqual(mockTask);
    });

    it('Throws an error task not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Create task', () => {
    it('Successfully created a task and return result', async () => {
      const task: CreateTaskDto = {
        title: 'Test create title',
        description: 'Test create description',
      };
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      taskRepository.createTask.mockResolvedValue(task);
      const result = await taskService.createTask(task, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(task, mockUser);
      expect(result).toEqual(task);
    });
  });

  describe('Delete task', () => {
    it('Successfully deleted a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await taskService.deleteTaskById(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('Task ID not throw an error on delete a task', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskService.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Update Task', () => {
    it('Update task status successfully', async () => {
      taskService.getTaskById = jest.fn().mockResolvedValue({
        save: taskRepository.save.mockResolvedValue(true),
        status: TaskStatus.OPEN,
      });
      expect(taskService.getTaskById).not.toHaveBeenCalled();

      const result = await taskService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(taskService.getTaskById).toHaveBeenCalled();
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
