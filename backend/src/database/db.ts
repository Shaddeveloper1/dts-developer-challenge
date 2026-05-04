// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require('node:sqlite');
import path from 'path';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeSqliteDB = any;

const DB_PATH = process.env.DATABASE_PATH || './data/tasks.db';

let db: NodeSqliteDB;

export function getDatabase(): NodeSqliteDB {
  if (!db) {
    const resolvedPath = path.resolve(DB_PATH);
    const dir = path.dirname(resolvedPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new DatabaseSync(resolvedPath);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
    initialiseSchema(db);
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = undefined;
  }
}

function initialiseSchema(database: NodeSqliteDB): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      status      TEXT NOT NULL DEFAULT 'TODO'
                  CHECK(status IN ('TODO', 'IN_PROGRESS', 'DONE')),
      due_date    TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );
  `);
}
