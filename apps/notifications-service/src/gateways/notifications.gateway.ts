import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../services/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  constructor(private notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
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

  @SubscribeMessage('authenticate')
  handleAuthenticate(client: Socket, userId: string) {
    const sockets = this.userSockets.get(userId) || [];
    sockets.push(client.id);
    this.userSockets.set(userId, sockets);

    console.log(`User ${userId} authenticated with socket ${client.id}`);
  }

  async emitToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);

    if (sockets && sockets.length > 0) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  async broadcastTaskCreated(event: any) {
    if (event.assigneeIds && event.assigneeIds.length > 0) {
      for (const userId of event.assigneeIds) {
        await this.emitToUser(userId, 'task:created', event);
      }
    }
  }

  async broadcastTaskUpdated(event: any) {
    if (event.assigneeIds && event.assigneeIds.length > 0) {
      for (const userId of event.assigneeIds) {
        if (userId !== event.updatedById) {
          await this.emitToUser(userId, 'task:updated', event);
        }
      }
    }
  }

  async broadcastCommentCreated(event: any) {
    if (event.assigneeIds && event.assigneeIds.length > 0) {
      for (const userId of event.assigneeIds) {
        if (userId !== event.userId) {
          await this.emitToUser(userId, 'comment:new', event);
        }
      }
    }
  }
}
