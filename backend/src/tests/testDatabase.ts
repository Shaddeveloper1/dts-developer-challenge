// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DatabaseSync } = require('node:sqlite');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeSqliteDB = any;

let testDb: NodeSqliteDB;

export function createTestDatabase(): NodeSqliteDB {
  testDb = new DatabaseSync(':memory:');
  testDb.exec('PRAGMA journal_mode = WAL');
  testDb.exec('PRAGMA foreign_keys = ON');
  testDb.exec(`
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
  return testDb;
}

export function getTestDatabase(): NodeSqliteDB {
  return testDb;
}

export function closeTestDatabase(): void {
  if (testDb) {
    testDb.close();
  }
}
