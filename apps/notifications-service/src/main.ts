import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsModule } from './notifications.module';
import { ValidationPipe } from '@nestjs/common';
import { EventsConsumerService } from './services/events-consumer.service';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
      queue: 'events_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.startAllMicroservices();

  const eventsConsumer = app.get(EventsConsumerService);

  const microservice = app.getMicroservices()[0];
  microservice.listen().then(() => {
    const channel = (microservice as any).server.channel;

    channel.consume('events_queue', async (msg: any) => {
      if (msg) {
        const pattern = msg.fields.routingKey;
        const content = JSON.parse(msg.content.toString());

        try {
          if (pattern === 'task.created') {
            await eventsConsumer.handleTaskCreatedEvent(content);
          } else if (pattern === 'task.updated') {
            await eventsConsumer.handleTaskUpdatedEvent(content);
          } else if (pattern === 'task.comment.created') {
            await eventsConsumer.handleCommentCreatedEvent(content);
          }

          channel.ack(msg);
        } catch (error) {
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
