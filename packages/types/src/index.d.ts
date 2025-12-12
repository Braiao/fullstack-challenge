export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    DONE = "DONE"
}
export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: Date;
    priority: Priority;
    status: TaskStatus;
    assignees: User[];
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
export interface Comment {
    id: string;
    content: string;
    taskId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
export interface TaskHistory {
    id: string;
    taskId: string;
    field: string;
    oldValue: string;
    newValue: string;
    changedBy: User;
    createdAt: Date;
}
export interface Notification {
    id: string;
    userId: string;
    type: 'task_assigned' | 'task_updated' | 'comment_created';
    title: string;
    message: string;
    taskId: string;
    read: boolean;
    createdAt: Date;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    email: string;
    username: string;
    password: string;
}
export interface CreateTaskDto {
    title: string;
    description: string;
    deadline: Date;
    priority: Priority;
    assigneeIds?: string[];
}
export interface UpdateTaskDto {
    title?: string;
    description?: string;
    deadline?: Date;
    priority?: Priority;
    status?: TaskStatus;
    assigneeIds?: string[];
}
export interface CreateCommentDto {
    content: string;
}
export interface PaginationQuery {
    page?: number;
    size?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
}
export interface WebSocketEvent {
    event: 'task:created' | 'task:updated' | 'comment:new';
    data: any;
}
//# sourceMappingURL=index.d.ts.map