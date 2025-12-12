import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.update(id, { read: true });
  }

  async handleTaskCreated(event: any): Promise<void> {
    if (!event.assigneeIds || event.assigneeIds.length === 0) {
      return;
    }

    for (const userId of event.assigneeIds) {
      await this.create({
        userId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to task: ${event.title}`,
        taskId: event.taskId,
      });
    }
  }

  async handleTaskUpdated(event: any): Promise<void> {
    if (!event.assigneeIds || event.assigneeIds.length === 0) {
      return;
    }

    for (const userId of event.assigneeIds) {
      if (userId === event.updatedById) continue;

      await this.create({
        userId,
        type: 'task_updated',
        title: 'Task Updated',
        message: `A task you are assigned to has been updated`,
        taskId: event.taskId,
      });
    }
  }

  async handleCommentCreated(event: any): Promise<void> {
    if (!event.assigneeIds || event.assigneeIds.length === 0) {
      return;
    }

    for (const userId of event.assigneeIds) {
      if (userId === event.userId) continue;

      await this.create({
        userId,
        type: 'comment_created',
        title: 'New Comment',
        message: `New comment on a task you are assigned to`,
        taskId: event.taskId,
      });
    }
  }
}
