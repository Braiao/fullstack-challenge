import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, PaginationQuery } from '@repo/types';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('tasks.findAll')
  async findAll(@Payload() query: PaginationQuery) {
    return this.tasksService.findAll(query);
  }

  @MessagePattern('tasks.findOne')
  async findOne(@Payload() id: string) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern('tasks.create')
  async create(@Payload() data: { dto: CreateTaskDto; userId: string }) {
    return this.tasksService.create(data.dto, data.userId);
  }

  @MessagePattern('tasks.update')
  async update(@Payload() data: { id: string; dto: UpdateTaskDto; userId: string }) {
    return this.tasksService.update(data.id, data.dto, data.userId);
  }

  @MessagePattern('tasks.remove')
  async remove(@Payload() id: string) {
    return this.tasksService.remove(id);
  }

  @MessagePattern('tasks.comments.findAll')
  async findComments(@Payload() data: { taskId: string; query: PaginationQuery }) {
    return this.tasksService.findComments(data.taskId, data.query);
  }

  @MessagePattern('tasks.comments.create')
  async createComment(@Payload() data: { taskId: string; dto: CreateCommentDto; userId: string }) {
    return this.tasksService.createComment(data.taskId, data.dto, data.userId);
  }

  @MessagePattern('tasks.history.findAll')
  async findHistory(@Payload() taskId: string) {
    return this.tasksService.findHistory(taskId);
  }
}
