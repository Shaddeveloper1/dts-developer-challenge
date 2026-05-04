export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const STATUS_COLOURS: Record<TaskStatus, string> = {
  TODO: '#e3f2fd',
  IN_PROGRESS: '#fff8e1',
  DONE: '#e8f5e9',
};

export const STATUS_TEXT_COLOURS: Record<TaskStatus, string> = {
  TODO: '#1565c0',
  IN_PROGRESS: '#f57f17',
  DONE: '#2e7d32',
};

export const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
