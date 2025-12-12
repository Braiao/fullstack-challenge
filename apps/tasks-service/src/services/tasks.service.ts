import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Task } from '../entities/task.entity';
import { Comment } from '../entities/comment.entity';
import { TaskHistory } from '../entities/task-history.entity';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, PaginationQuery, PaginatedResponse } from '@repo/types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
    @Inject('RABBITMQ_CLIENT')
    private client: ClientProxy,
  ) {}

  async findAll(query: PaginationQuery): Promise<PaginatedResponse<Task>> {
    const page = query.page || 1;
    const size = query.size || 10;
    const skip = (page - 1) * size;

    const [data, total] = await this.taskRepository.findAndCount({
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdById: userId,
      assigneeIds: createTaskDto.assigneeIds || [],
    });

    const savedTask = await this.taskRepository.save(task);

    this.client.emit('task.created', {
      taskId: savedTask.id,
      assigneeIds: savedTask.assigneeIds,
      createdById: userId,
      title: savedTask.title,
    });

    return savedTask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id);

    const changes = [];

    if (updateTaskDto.title && updateTaskDto.title !== task.title) {
      changes.push({ field: 'title', oldValue: task.title, newValue: updateTaskDto.title });
    }

    if (updateTaskDto.description && updateTaskDto.description !== task.description) {
      changes.push({ field: 'description', oldValue: task.description, newValue: updateTaskDto.description });
    }

    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      changes.push({ field: 'status', oldValue: task.status, newValue: updateTaskDto.status });
    }

    if (updateTaskDto.priority && updateTaskDto.priority !== task.priority) {
      changes.push({ field: 'priority', oldValue: task.priority, newValue: updateTaskDto.priority });
    }

    if (updateTaskDto.assigneeIds) {
      const oldAssignees = task.assigneeIds?.join(',') || '';
      const newAssignees = updateTaskDto.assigneeIds.join(',');
      if (oldAssignees !== newAssignees) {
        changes.push({ field: 'assignees', oldValue: oldAssignees, newValue: newAssignees });
      }
    }

    for (const change of changes) {
      await this.historyRepository.save({
        taskId: id,
        ...change,
        changedById: userId,
      });
    }

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    this.client.emit('task.updated', {
      taskId: updatedTask.id,
      assigneeIds: updatedTask.assigneeIds,
      changes: changes.map(c => c.field),
      updatedById: userId,
      status: updatedTask.status,
    });

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  async findComments(taskId: string, query: PaginationQuery): Promise<PaginatedResponse<Comment>> {
    await this.findOne(taskId);

    const page = query.page || 1;
    const size = query.size || 10;
    const skip = (page - 1) * size;

    const [data, total] = await this.commentRepository.findAndCount({
      where: { taskId },
      skip,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async createComment(taskId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const task = await this.findOne(taskId);

    const comment = this.commentRepository.create({
      ...createCommentDto,
      taskId,
      userId,
    });

    const savedComment = await this.commentRepository.save(comment);

    this.client.emit('task.comment.created', {
      taskId,
      commentId: savedComment.id,
      assigneeIds: task.assigneeIds,
      userId,
      content: savedComment.content,
    });

    return savedComment;
  }

  async findHistory(taskId: string): Promise<TaskHistory[]> {
    await this.findOne(taskId);

    return this.historyRepository.find({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });
  }
}
