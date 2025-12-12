import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Inject, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto, CreateCommentDto } from '../dto/task.dto';
import { lastValueFrom } from 'rxjs';

@ApiTags('Tasks')
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE')
    private tasksClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async findAll(@Query('page') page?: number, @Query('size') size?: number) {
    return lastValueFrom(this.tasksClient.send('tasks.findAll', { page, size }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string) {
    return lastValueFrom(this.tasksClient.send('tasks.findOne', id));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return lastValueFrom(
      this.tasksClient.send('tasks.create', {
        dto: createTaskDto,
        userId: req.user.id,
      }),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return lastValueFrom(
      this.tasksClient.send('tasks.update', {
        id,
        dto: updateTaskDto,
        userId: req.user.id,
      }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string) {
    return lastValueFrom(this.tasksClient.send('tasks.remove', id));
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get task comments with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'size', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async findComments(@Param('id') taskId: string, @Query('page') page?: number, @Query('size') size?: number) {
    return lastValueFrom(
      this.tasksClient.send('tasks.comments.findAll', {
        taskId,
        query: { page, size },
      }),
    );
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Create a comment on a task' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(@Param('id') taskId: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    return lastValueFrom(
      this.tasksClient.send('tasks.comments.create', {
        taskId,
        dto: createCommentDto,
        userId: req.user.id,
      }),
    );
  }
}
