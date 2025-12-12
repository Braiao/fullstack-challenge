"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const task_entity_1 = require("./entities/task.entity");
const comment_entity_1 = require("./entities/comment.entity");
const task_history_entity_1 = require("./entities/task-history.entity");
const tasks_service_1 = require("./services/tasks.service");
const tasks_controller_1 = require("./controllers/tasks.controller");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'localhost',
                port: parseInt(process.env.DATABASE_PORT || '5432'),
                username: process.env.DATABASE_USER || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'password',
                database: process.env.DATABASE_NAME || 'challenge_db',
                entities: [task_entity_1.Task, comment_entity_1.Comment, task_history_entity_1.TaskHistory],
                synchronize: process.env.NODE_ENV === 'development',
                logging: process.env.NODE_ENV === 'development',
            }),
            typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, comment_entity_1.Comment, task_history_entity_1.TaskHistory]),
            microservices_1.ClientsModule.register([
                {
                    name: 'RABBITMQ_CLIENT',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
                        queue: 'events_queue',
                        queueOptions: {
                            durable: true,
                        },
                    },
                },
            ]),
        ],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService],
    })
], TasksModule);
//# sourceMappingURL=tasks.module.js.map