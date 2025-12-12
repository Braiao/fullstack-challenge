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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const microservices_1 = require("@nestjs/microservices");
const task_entity_1 = require("../entities/task.entity");
const comment_entity_1 = require("../entities/comment.entity");
const task_history_entity_1 = require("../entities/task-history.entity");
let TasksService = class TasksService {
    constructor(taskRepository, commentRepository, historyRepository, client) {
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.historyRepository = historyRepository;
        this.client = client;
    }
    async findAll(query) {
        const page = query.page || 1;
        const size = query.size || 10;
        const skip = (page - 1) * size;
        const [data, total] = await this.taskRepository.findAndCount({
            skip,
            take: size,
            order: { createdAt: 'DESC' },
        });
        return {
            data,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async findOne(id) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        return task;
    }
    async create(createTaskDto, userId) {
        const task = this.taskRepository.create({
            ...createTaskDto,
            createdById: userId,
            assigneeIds: createTaskDto.assigneeIds || [],
        });
        const savedTask = await this.taskRepository.save(task);
        this.client.emit('task.created', {
            taskId: savedTask.id,
            assigneeIds: savedTask.assigneeIds,
            createdById: userId,
            title: savedTask.title,
        });
        return savedTask;
    }
    async update(id, updateTaskDto, userId) {
        const task = await this.findOne(id);
        const changes = [];
        if (updateTaskDto.title && updateTaskDto.title !== task.title) {
            changes.push({ field: 'title', oldValue: task.title, newValue: updateTaskDto.title });
        }
        if (updateTaskDto.description && updateTaskDto.description !== task.description) {
            changes.push({ field: 'description', oldValue: task.description, newValue: updateTaskDto.description });
        }
        if (updateTaskDto.status && updateTaskDto.status !== task.status) {
            changes.push({ field: 'status', oldValue: task.status, newValue: updateTaskDto.status });
        }
        if (updateTaskDto.priority && updateTaskDto.priority !== task.priority) {
            changes.push({ field: 'priority', oldValue: task.priority, newValue: updateTaskDto.priority });
        }
        if (updateTaskDto.assigneeIds) {
            const oldAssignees = task.assigneeIds?.join(',') || '';
            const newAssignees = updateTaskDto.assigneeIds.join(',');
            if (oldAssignees !== newAssignees) {
                changes.push({ field: 'assignees', oldValue: oldAssignees, newValue: newAssignees });
            }
        }
        for (const change of changes) {
            await this.historyRepository.save({
                taskId: id,
                ...change,
                changedById: userId,
            });
        }
        Object.assign(task, updateTaskDto);
        const updatedTask = await this.taskRepository.save(task);
        this.client.emit('task.updated', {
            taskId: updatedTask.id,
            assigneeIds: updatedTask.assigneeIds,
            changes: changes.map(c => c.field),
            updatedById: userId,
            status: updatedTask.status,
        });
        return updatedTask;
    }
    async remove(id) {
        const task = await this.findOne(id);
        await this.taskRepository.remove(task);
    }
    async findComments(taskId, query) {
        await this.findOne(taskId);
        const page = query.page || 1;
        const size = query.size || 10;
        const skip = (page - 1) * size;
        const [data, total] = await this.commentRepository.findAndCount({
            where: { taskId },
            skip,
            take: size,
            order: { createdAt: 'DESC' },
        });
        return {
            data,
            total,
            page,
            size,
            totalPages: Math.ceil(total / size),
        };
    }
    async createComment(taskId, createCommentDto, userId) {
        const task = await this.findOne(taskId);
        const comment = this.commentRepository.create({
            ...createCommentDto,
            taskId,
            userId,
        });
        const savedComment = await this.commentRepository.save(comment);
        this.client.emit('task.comment.created', {
            taskId,
            commentId: savedComment.id,
            assigneeIds: task.assigneeIds,
            userId,
            content: savedComment.content,
        });
        return savedComment;
    }
    async findHistory(taskId) {
        await this.findOne(taskId);
        return this.historyRepository.find({
            where: { taskId },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(task_history_entity_1.TaskHistory)),
    __param(3, (0, common_1.Inject)('RABBITMQ_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        microservices_1.ClientProxy])
], TasksService);
//# sourceMappingURL=tasks.service.js.map