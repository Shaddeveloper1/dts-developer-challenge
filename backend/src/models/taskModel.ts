import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db';
import { Task, CreateTaskDto, UpdateTaskStatusDto, TaskStatus, VALID_STATUSES } from '../types/task.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeSqliteDB = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status as TaskStatus,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAllTasks(): Task[] {
  const db: NodeSqliteDB = getDatabase();
  const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  return rows.map(rowToTask);
}

export function getTaskById(id: string): Task | null {
  const db: NodeSqliteDB = getDatabase();
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return row ? rowToTask(row) : null;
}

export function createTask(dto: CreateTaskDto): Task {
  const db: NodeSqliteDB = getDatabase();
  const now = new Date().toISOString();
  const id = uuidv4();
  const status: TaskStatus = dto.status && VALID_STATUSES.includes(dto.status) ? dto.status : 'TODO';

  db.prepare(`
    INSERT INTO tasks (id, title, description, status, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, dto.title, dto.description ?? null, status, dto.dueDate, now, now);

  return getTaskById(id) as Task;
}

export function updateTaskStatus(id: string, dto: UpdateTaskStatusDto): Task | null {
  const db: NodeSqliteDB = getDatabase();
  const existing = getTaskById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  db.prepare('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?').run(dto.status, now, id);
  return getTaskById(id);
}

export function deleteTask(id: string): boolean {
  const db: NodeSqliteDB = getDatabase();
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}
