"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const notifications_module_1 = require("./notifications.module");
const common_1 = require("@nestjs/common");
const events_consumer_service_1 = require("./services/events-consumer.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(notifications_module_1.NotificationsModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
            queue: 'events_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.startAllMicroservices();
    const eventsConsumer = app.get(events_consumer_service_1.EventsConsumerService);
    const microservice = app.getMicroservices()[0];
    microservice.listen().then(() => {
        const channel = microservice.server.channel;
        channel.consume('events_queue', async (msg) => {
            if (msg) {
                const pattern = msg.fields.routingKey;
                const content = JSON.parse(msg.content.toString());
                try {
                    if (pattern === 'task.created') {
                        await eventsConsumer.handleTaskCreatedEvent(content);
                    }
                    else if (pattern === 'task.updated') {
                        await eventsConsumer.handleTaskUpdatedEvent(content);
                    }
                    else if (pattern === 'task.comment.created') {
                        await eventsConsumer.handleCommentCreatedEvent(content);
                    }
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg);
                }
            }
        });
    });
    await app.listen(process.env.PORT || 3004);
    console.log(`Notifications Service is running on port ${process.env.PORT || 3004}`);
}
bootstrap();
//# sourceMappingURL=main.js.map