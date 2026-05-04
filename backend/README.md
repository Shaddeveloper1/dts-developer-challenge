# HMCTS Task Manager — Backend

REST API for managing caseworker tasks, built with Node.js, Express, TypeScript and SQLite.

## Getting Started

```bash
npm install
npm run dev       # development server with auto-reload on :3000
npm run build     # compile TypeScript to dist/
npm start         # run compiled output
```

### Environment Variables

Copy `.env` and adjust as needed:

| Variable        | Default          | Description |
|-----------------|------------------|-------------|
| `PORT`          | `3000`           | HTTP port   |
| `DATABASE_PATH` | `./data/tasks.db`| SQLite file path |
| `NODE_ENV`      | `development`    | Environment |

## API Documentation

Interactive Swagger UI is served at **`http://localhost:3000/api-docs`** when the server is running.

### Endpoints

| Method | Path                       | Description              |
|--------|----------------------------|--------------------------|
| GET    | `/api/tasks`               | Retrieve all tasks       |
| GET    | `/api/tasks/:id`           | Retrieve a task by ID    |
| POST   | `/api/tasks`               | Create a new task        |
| PATCH  | `/api/tasks/:id/status`    | Update task status       |
| DELETE | `/api/tasks/:id`           | Delete a task            |
| GET    | `/health`                  | Health check             |

### Task Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review case file",
  "description": "Check all documents are in order",
  "status": "TODO",
  "dueDate": "2025-06-01T09:00:00.000Z",
  "createdAt": "2025-05-01T10:00:00.000Z",
  "updatedAt": "2025-05-01T10:00:00.000Z"
}
```

Valid statuses: `TODO` | `IN_PROGRESS` | `DONE`

### Create Task — Request Body

```json
{
  "title": "Review case file",       // required, max 255 chars
  "description": "Check documents",  // optional, max 1000 chars
  "status": "TODO",                  // optional, defaults to TODO
  "dueDate": "2025-06-01T09:00:00Z"  // required, ISO 8601
}
```

### Update Status — Request Body

```json
{ "status": "IN_PROGRESS" }
```

## Running Tests

```bash
npm test                # run all tests
npm run test:coverage   # with coverage report
```

Tests use an **in-memory SQLite database** so no setup is required.

## Project Structure

```
src/
├── app.ts               # Express app factory
├── server.ts            # Entry point
├── swagger.ts           # OpenAPI spec
├── controllers/
│   └── taskController.ts
├── database/
│   └── db.ts            # SQLite connection & schema
├── middleware/
│   └── errorHandler.ts
├── models/
│   └── taskModel.ts     # Data access layer
├── routes/
│   └── tasks.ts         # Route definitions + Swagger annotations
├── types/
│   └── task.types.ts
└── tests/
    ├── tasks.test.ts
    └── testDatabase.ts
```
