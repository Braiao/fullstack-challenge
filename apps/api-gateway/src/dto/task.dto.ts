import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Priority, TaskStatus } from '@repo/types';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Add JWT-based authentication to the API' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty({ enum: Priority, example: Priority.HIGH })
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;

  @ApiPropertyOptional({ type: [String], example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  assigneeIds?: string[];
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @ApiPropertyOptional({ enum: Priority, example: Priority.URGENT })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ type: [String], example: ['uuid-1', 'uuid-2'] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  assigneeIds?: string[];
}

export class CreateCommentDto {
  @ApiProperty({ example: 'This looks great!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
