import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto, PaginationQuery } from '@repo/types';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(query: PaginationQuery): Promise<import("@repo/types").PaginatedResponse<import("../entities/task.entity").Task>>;
    findOne(id: string): Promise<import("../entities/task.entity").Task>;
    create(data: {
        dto: CreateTaskDto;
        userId: string;
    }): Promise<import("../entities/task.entity").Task>;
    update(data: {
        id: string;
        dto: UpdateTaskDto;
        userId: string;
    }): Promise<import("../entities/task.entity").Task>;
    remove(id: string): Promise<void>;
    findComments(data: {
        taskId: string;
        query: PaginationQuery;
    }): Promise<import("@repo/types").PaginatedResponse<import("../entities/comment.entity").Comment>>;
    createComment(data: {
        taskId: string;
        dto: CreateCommentDto;
        userId: string;
    }): Promise<import("../entities/comment.entity").Comment>;
    findHistory(taskId: string): Promise<import("../entities/task-history.entity").TaskHistory[]>;
}
//# sourceMappingURL=tasks.controller.d.ts.map