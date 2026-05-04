import axios from 'axios';
import { Task, CreateTaskPayload, TaskStatus } from '../types/task';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchAllTasks(): Promise<Task[]> {
  const { data } = await api.get<{ success: boolean; data: Task[] }>('/tasks');
  return data.data;
}

export async function fetchTaskById(id: string): Promise<Task> {
  const { data } = await api.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
  return data.data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<{ success: boolean; data: Task }>('/tasks', payload);
  return data.data;
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
  const { data } = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}/status`, { status });
  return data.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
