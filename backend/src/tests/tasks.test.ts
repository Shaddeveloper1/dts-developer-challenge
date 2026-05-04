import supertest from 'supertest';
import { createApp } from '../app';
import * as db from '../database/db';
import { createTestDatabase, closeTestDatabase, getTestDatabase } from './testDatabase';

// Mock the database module to use in-memory DB for tests
jest.mock('../database/db', () => ({
  getDatabase: jest.fn(),
  closeDatabase: jest.fn(),
}));

const mockedGetDatabase = db.getDatabase as jest.MockedFunction<typeof db.getDatabase>;

describe('Tasks API', () => {
  let app: ReturnType<typeof createApp>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testDb: any;

  beforeAll(() => {
    testDb = createTestDatabase();
    mockedGetDatabase.mockReturnValue(testDb);
    app = createApp();
  });

  afterAll(() => {
    closeTestDatabase();
  });

  beforeEach(() => {
    // Clear all tasks before each test
    getTestDatabase().exec('DELETE FROM tasks');
  });

  // ─── GET /api/tasks ─────────────────────────────────────────────────────────
  describe('GET /api/tasks', () => {
    it('should return an empty list when no tasks exist', async () => {
      const res = await supertest(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    it('should return all tasks', async () => {
      await supertest(app).post('/api/tasks').send({
        title: 'Task 1',
        dueDate: '2025-12-01T10:00:00.000Z',
      });
      await supertest(app).post('/api/tasks').send({
        title: 'Task 2',
        dueDate: '2025-12-02T10:00:00.000Z',
      });

      const res = await supertest(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.count).toBe(2);
    });
  });

  // ─── POST /api/tasks ─────────────────────────────────────────────────────────
  describe('POST /api/tasks', () => {
    it('should create a task with required fields only', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        title: 'Review case file',
        dueDate: '2025-06-01T09:00:00.000Z',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: 'Review case file',
        status: 'TODO',
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.description).toBeUndefined();
    });

    it('should create a task with all fields', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        title: 'Review case file',
        description: 'Check all documents',
        status: 'IN_PROGRESS',
        dueDate: '2025-06-01T09:00:00.000Z',
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({
        title: 'Review case file',
        description: 'Check all documents',
        status: 'IN_PROGRESS',
      });
    });

    it('should return 400 when title is missing', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 when dueDate is missing', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        title: 'Some task',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid status', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        title: 'Some task',
        dueDate: '2025-06-01T09:00:00.000Z',
        status: 'INVALID_STATUS',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid dueDate format', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        title: 'Some task',
        dueDate: 'not-a-date',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when title exceeds 255 characters', async () => {
      const res = await supertest(app).post('/api/tasks').send({
        title: 'A'.repeat(256),
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      expect(res.status).toBe(400);
    });
  });

  // ─── GET /api/tasks/:id ───────────────────────────────────────────────────────
  describe('GET /api/tasks/:id', () => {
    it('should retrieve a task by ID', async () => {
      const createRes = await supertest(app).post('/api/tasks').send({
        title: 'My task',
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      const id = createRes.body.data.id;

      const res = await supertest(app).get(`/api/tasks/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(id);
      expect(res.body.data.title).toBe('My task');
    });

    it('should return 404 for a non-existent task', async () => {
      const res = await supertest(app).get('/api/tasks/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for an invalid UUID', async () => {
      const res = await supertest(app).get('/api/tasks/not-a-uuid');
      expect(res.status).toBe(400);
    });
  });

  // ─── PATCH /api/tasks/:id/status ─────────────────────────────────────────────
  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const createRes = await supertest(app).post('/api/tasks').send({
        title: 'My task',
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      const id = createRes.body.data.id;

      const res = await supertest(app).patch(`/api/tasks/${id}/status`).send({ status: 'IN_PROGRESS' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('should return 404 when updating status of non-existent task', async () => {
      const res = await supertest(app)
        .patch('/api/tasks/00000000-0000-0000-0000-000000000000/status')
        .send({ status: 'DONE' });
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid status value', async () => {
      const createRes = await supertest(app).post('/api/tasks').send({
        title: 'My task',
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      const id = createRes.body.data.id;

      const res = await supertest(app).patch(`/api/tasks/${id}/status`).send({ status: 'INVALID' });
      expect(res.status).toBe(400);
    });

    it('should return 400 when status is missing', async () => {
      const createRes = await supertest(app).post('/api/tasks').send({
        title: 'My task',
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      const id = createRes.body.data.id;

      const res = await supertest(app).patch(`/api/tasks/${id}/status`).send({});
      expect(res.status).toBe(400);
    });
  });

  // ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const createRes = await supertest(app).post('/api/tasks').send({
        title: 'Task to delete',
        dueDate: '2025-06-01T09:00:00.000Z',
      });
      const id = createRes.body.data.id;

      const deleteRes = await supertest(app).delete(`/api/tasks/${id}`);
      expect(deleteRes.status).toBe(204);

      const getRes = await supertest(app).get(`/api/tasks/${id}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 when deleting a non-existent task', async () => {
      const res = await supertest(app).delete('/api/tasks/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });

    it('should return 400 for an invalid UUID', async () => {
      const res = await supertest(app).delete('/api/tasks/not-a-uuid');
      expect(res.status).toBe(400);
    });
  });

  // ─── Health check ─────────────────────────────────────────────────────────────
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await supertest(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ─── 404 handler ─────────────────────────────────────────────────────────────
  describe('Unknown routes', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await supertest(app).get('/api/unknown');
      expect(res.status).toBe(404);
    });
  });
});
