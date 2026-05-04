# HMCTS Task Manager — Frontend

React/TypeScript single-page application for managing caseworker tasks.

## Getting Started

```bash
npm install
npm run dev     # development server on :5173
npm run build   # production build → dist/
npm run preview # preview production build
```

> The backend must be running on port 3000. Vite proxies `/api/*` requests automatically.

## Running Tests

```bash
npm test              # run tests once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## Features

- **Task list** with status filter tabs (All / To Do / In Progress / Done)
- **Create tasks** via a validated form (title, optional description, status, due date)
- **Update status** inline from any task card
- **Delete tasks** with a confirmation modal
- **Overdue indicator** for tasks past their due date that are not yet Done
- **Toast notifications** for all actions

## Project Structure

```
src/
├── App.tsx / App.module.css    # Root component & styles
├── main.tsx                    # React entry point
├── index.css                   # Global reset
├── api/
│   └── tasks.ts                # Axios API client
├── components/
│   ├── TaskCard.tsx/.module.css
│   ├── TaskForm.tsx/.module.css
│   └── DeleteModal.tsx/.module.css
├── types/
│   └── task.ts                 # Shared TypeScript types
└── tests/
    ├── setup.ts
    ├── TaskCard.test.tsx
    ├── TaskForm.test.tsx
    └── DeleteModal.test.tsx
```
