import { ClientProxy } from '@nestjs/microservices';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto } from '../dto/task.dto';
export declare class TasksController {
    private tasksClient;
    constructor(tasksClient: ClientProxy);
    findAll(page?: number, size?: number): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createTaskDto: CreateTaskDto, req: any): Promise<any>;
    update(id: string, updateTaskDto: UpdateTaskDto, req: any): Promise<any>;
    remove(id: string): Promise<any>;
    findComments(taskId: string, page?: number, size?: number): Promise<any>;
    createComment(taskId: string, createCommentDto: CreateCommentDto, req: any): Promise<any>;
}
//# sourceMappingURL=tasks.controller.d.ts.map