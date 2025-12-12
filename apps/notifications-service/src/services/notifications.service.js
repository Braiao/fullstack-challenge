"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async create(data) {
        const notification = this.notificationRepository.create(data);
        return this.notificationRepository.save(notification);
    }
    async findByUserId(userId) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async markAsRead(id) {
        await this.notificationRepository.update(id, { read: true });
    }
    async handleTaskCreated(event) {
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
    async handleTaskUpdated(event) {
        if (!event.assigneeIds || event.assigneeIds.length === 0) {
            return;
        }
        for (const userId of event.assigneeIds) {
            if (userId === event.updatedById)
                continue;
            await this.create({
                userId,
                type: 'task_updated',
                title: 'Task Updated',
                message: `A task you are assigned to has been updated`,
                taskId: event.taskId,
            });
        }
    }
    async handleCommentCreated(event) {
        if (!event.assigneeIds || event.assigneeIds.length === 0) {
            return;
        }
        for (const userId of event.assigneeIds) {
            if (userId === event.userId)
                continue;
            await this.create({
                userId,
                type: 'comment_created',
                title: 'New Comment',
                message: `New comment on a task you are assigned to`,
                taskId: event.taskId,
            });
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map