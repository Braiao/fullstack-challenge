import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
export declare class NotificationsService {
    private notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    create(data: Partial<Notification>): Promise<Notification>;
    findByUserId(userId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<void>;
    handleTaskCreated(event: any): Promise<void>;
    handleTaskUpdated(event: any): Promise<void>;
    handleCommentCreated(event: any): Promise<void>;
}
//# sourceMappingURL=notifications.service.d.ts.map