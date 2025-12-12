export declare class Notification {
    id: string;
    userId: string;
    type: 'task_assigned' | 'task_updated' | 'comment_created';
    title: string;
    message: string;
    taskId: string;
    read: boolean;
    createdAt: Date;
}
//# sourceMappingURL=notification.entity.d.ts.map