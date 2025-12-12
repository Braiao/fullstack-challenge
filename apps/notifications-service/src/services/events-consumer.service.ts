import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from '../gateways/notifications.gateway';

@Injectable()
export class EventsConsumerService implements OnModuleInit {
  constructor(
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async onModuleInit() {
    console.log('Events Consumer Service initialized');
  }

  async handleTaskCreatedEvent(event: any) {
    await this.notificationsService.handleTaskCreated(event);
    await this.notificationsGateway.broadcastTaskCreated(event);
  }

  async handleTaskUpdatedEvent(event: any) {
    await this.notificationsService.handleTaskUpdated(event);
    await this.notificationsGateway.broadcastTaskUpdated(event);
  }

  async handleCommentCreatedEvent(event: any) {
    await this.notificationsService.handleCommentCreated(event);
    await this.notificationsGateway.broadcastCommentCreated(event);
  }
}
