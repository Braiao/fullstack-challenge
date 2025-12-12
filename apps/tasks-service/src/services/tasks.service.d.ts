import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Task } from '../entities/task.entity';
import { Comment } from '../entities/comment.entity';
import { TaskHistory } from '../entities/task-history.entity';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, PaginationQuery, PaginatedResponse } from '@repo/types';
export declare class TasksService {
    private taskRepository;
    private commentRepository;
    private historyRepository;
    private client;
    constructor(taskRepository: Repository<Task>, commentRepository: Repository<Comment>, historyRepository: Repository<TaskHistory>, client: ClientProxy);
    findAll(query: PaginationQuery): Promise<PaginatedResponse<Task>>;
    findOne(id: string): Promise<Task>;
    create(createTaskDto: CreateTaskDto, userId: string): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task>;
    remove(id: string): Promise<void>;
    findComments(taskId: string, query: PaginationQuery): Promise<PaginatedResponse<Comment>>;
    createComment(taskId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment>;
    findHistory(taskId: string): Promise<TaskHistory[]>;
}
//# sourceMappingURL=tasks.service.d.ts.map