import { Task } from './task.entity';
export declare class TaskHistory {
    id: string;
    taskId: string;
    task: Task;
    field: string;
    oldValue: string;
    newValue: string;
    changedById: string;
    createdAt: Date;
}
//# sourceMappingURL=task-history.entity.d.ts.map