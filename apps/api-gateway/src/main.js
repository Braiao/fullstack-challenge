"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('Collaborative Task Management System API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Authentication', 'User authentication endpoints')
        .addTag('Tasks', 'Task management endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT || 3001);
    console.log(`API Gateway is running on port ${process.env.PORT || 3001}`);
    console.log(`Swagger documentation available at http://localhost:${process.env.PORT || 3001}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map