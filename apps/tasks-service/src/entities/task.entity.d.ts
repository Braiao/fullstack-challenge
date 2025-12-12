import { Priority, TaskStatus } from '@repo/types';
import { Comment } from './comment.entity';
import { TaskHistory } from './task-history.entity';
export declare class Task {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    priority: Priority;
    status: TaskStatus;
    assigneeIds: string[];
    createdById: string;
    comments: Comment[];
    history: TaskHistory[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=task.entity.d.ts.map