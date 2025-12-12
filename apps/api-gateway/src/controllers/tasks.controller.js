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
exports.TasksController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const task_dto_1 = require("../dto/task.dto");
const rxjs_1 = require("rxjs");
let TasksController = class TasksController {
    constructor(tasksClient) {
        this.tasksClient = tasksClient;
    }
    async findAll(page, size) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.findAll', { page, size }));
    }
    async findOne(id) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.findOne', id));
    }
    async create(createTaskDto, req) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.create', {
            dto: createTaskDto,
            userId: req.user.id,
        }));
    }
    async update(id, updateTaskDto, req) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.update', {
            id,
            dto: updateTaskDto,
            userId: req.user.id,
        }));
    }
    async remove(id) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.remove', id));
    }
    async findComments(taskId, page, size) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.comments.findAll', {
            taskId,
            query: { page, size },
        }));
    }
    async createComment(taskId, createCommentDto, req) {
        return (0, rxjs_1.lastValueFrom)(this.tasksClient.send('tasks.comments.create', {
            taskId,
            dto: createCommentDto,
            userId: req.user.id,
        }));
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task comments with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comments retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findComments", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a comment on a task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment created successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "createComment", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, common_1.Controller)('api/tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)('TASKS_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map