# HMCTS Task Manager

A full-stack task management system for HMCTS caseworkers to track and manage their tasks efficiently.

## Project Structure

```
├── backend/    # Node.js/Express/TypeScript REST API
└── frontend/   # React/TypeScript single-page application
```

## Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.  
Interactive API docs (Swagger UI): `http://localhost:3000/api-docs`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** Start the backend first. The frontend proxies `/api` requests to `http://localhost:3000`.

---

## Features

- **Create tasks** with title, optional description, status, and due date/time  
- **View all tasks** with filter tabs (All / To Do / In Progress / Done)  
- **Update task status** inline via dropdown (TODO → IN_PROGRESS → DONE)  
- **Delete tasks** with a confirmation modal  
- **Overdue indicator** highlights tasks past their due date  
- **Responsive grid layout** for comfortable use at any screen size  

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Backend  | Node.js · Express · TypeScript · SQLite (node:sqlite) |
| API Docs | Swagger UI (OpenAPI 3.0) |
| Frontend | React 18 · TypeScript · Vite · CSS Modules |
| Testing  | Jest + Supertest (backend) · Vitest + React Testing Library (frontend) |
