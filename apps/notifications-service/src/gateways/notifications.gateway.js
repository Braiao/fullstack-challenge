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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const notifications_service_1 = require("../services/notifications.service");
let NotificationsGateway = class NotificationsGateway {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
        this.userSockets = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        for (const [userId, sockets] of this.userSockets.entries()) {
            const index = sockets.indexOf(client.id);
            if (index !== -1) {
                sockets.splice(index, 1);
                if (sockets.length === 0) {
                    this.userSockets.delete(userId);
                }
            }
        }
    }
    handleAuthenticate(client, userId) {
        const sockets = this.userSockets.get(userId) || [];
        sockets.push(client.id);
        this.userSockets.set(userId, sockets);
        console.log(`User ${userId} authenticated with socket ${client.id}`);
    }
    async emitToUser(userId, event, data) {
        const sockets = this.userSockets.get(userId);
        if (sockets && sockets.length > 0) {
            sockets.forEach((socketId) => {
                this.server.to(socketId).emit(event, data);
            });
        }
    }
    async broadcastTaskCreated(event) {
        if (event.assigneeIds && event.assigneeIds.length > 0) {
            for (const userId of event.assigneeIds) {
                await this.emitToUser(userId, 'task:created', event);
            }
        }
    }
    async broadcastTaskUpdated(event) {
        if (event.assigneeIds && event.assigneeIds.length > 0) {
            for (const userId of event.assigneeIds) {
                if (userId !== event.updatedById) {
                    await this.emitToUser(userId, 'task:updated', event);
                }
            }
        }
    }
    async broadcastCommentCreated(event) {
        if (event.assigneeIds && event.assigneeIds.length > 0) {
            for (const userId of event.assigneeIds) {
                if (userId !== event.userId) {
                    await this.emitToUser(userId, 'comment:new', event);
                }
            }
        }
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleAuthenticate", null);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map