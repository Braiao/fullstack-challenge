"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const auth_module_1 = require("./auth.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(auth_module_1.AuthModule, {
        transport: microservices_1.Transport.RMQ,
        options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
            queue: 'auth_queue',
            queueOptions: {
                durable: true,
            },
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    await app.listen();
    console.log('Auth Service is running on RabbitMQ');
}
bootstrap();
//# sourceMappingURL=main.js.map