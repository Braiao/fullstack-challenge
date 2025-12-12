import { useAuthStore } from '@/store/auth.store';
import type {
  RegisterDto,
  LoginDto,
  AuthTokens,
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  PaginatedResponse,
  Task,
  Comment
} from '@repo/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const { accessToken } = useAuthStore.getState();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  async register(data: RegisterDto): Promise<AuthTokens> {
    return this.fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginDto): Promise<AuthTokens> {
    return this.fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    return this.fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getTasks(page = 1, size = 10): Promise<PaginatedResponse<Task>> {
    return this.fetch(`/api/tasks?page=${page}&size=${size}`);
  }

  async getTask(id: string): Promise<Task> {
    return this.fetch(`/api/tasks/${id}`);
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<void> {
    return this.fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getComments(taskId: string, page = 1, size = 10): Promise<PaginatedResponse<Comment>> {
    return this.fetch(`/api/tasks/${taskId}/comments?page=${page}&size=${size}`);
  }

  async createComment(taskId: string, data: CreateCommentDto): Promise<Comment> {
    return this.fetch(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
