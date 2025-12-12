import { Priority, TaskStatus } from '@repo/types';
export declare class CreateTaskDto {
    title: string;
    description: string;
    deadline: Date;
    priority: Priority;
    assigneeIds?: string[];
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    deadline?: Date;
    priority?: Priority;
    status?: TaskStatus;
    assigneeIds?: string[];
}
export declare class CreateCommentDto {
    content: string;
}
//# sourceMappingURL=task.dto.d.ts.map