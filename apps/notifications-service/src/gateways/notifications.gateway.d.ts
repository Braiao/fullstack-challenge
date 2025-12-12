import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../services/notifications.service';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private notificationsService;
    server: Server;
    private userSockets;
    constructor(notificationsService: NotificationsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAuthenticate(client: Socket, userId: string): void;
    emitToUser(userId: string, event: string, data: any): Promise<void>;
    broadcastTaskCreated(event: any): Promise<void>;
    broadcastTaskUpdated(event: any): Promise<void>;
    broadcastCommentCreated(event: any): Promise<void>;
}
//# sourceMappingURL=notifications.gateway.d.ts.map