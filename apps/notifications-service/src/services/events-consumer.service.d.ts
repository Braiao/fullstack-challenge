import { OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from '../gateways/notifications.gateway';
export declare class EventsConsumerService implements OnModuleInit {
    private notificationsService;
    private notificationsGateway;
    constructor(notificationsService: NotificationsService, notificationsGateway: NotificationsGateway);
    onModuleInit(): Promise<void>;
    handleTaskCreatedEvent(event: any): Promise<void>;
    handleTaskUpdatedEvent(event: any): Promise<void>;
    handleCommentCreatedEvent(event: any): Promise<void>;
}
//# sourceMappingURL=events-consumer.service.d.ts.map