import React, { useEffect, useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Task, TaskStatus } from './types/task';
import { fetchAllTasks, createTask, updateTaskStatus, deleteTask } from './api/tasks';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { DeleteModal } from './components/DeleteModal';
import { CreateTaskPayload } from './types/task';
import styles from './App.module.css';

type FilterStatus = 'ALL' | TaskStatus;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchAllTasks();
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    try {
      const task = await createTask(payload);
      setTasks((prev) => [task, ...prev]);
      setShowForm(false);
      toast.success('Task created successfully');
    } catch {
      toast.error('Failed to create task. Please try again.');
      throw new Error('Create failed');
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setTaskToDelete(null);
    }
  };

  const filteredTasks = filterStatus === 'ALL'
    ? tasks
    : tasks.filter((t) => t.status === filterStatus);

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.logo}>HM</div>
            <div>
              <h1 className={styles.title}>HMCTS Task Manager</h1>
              <p className={styles.subtitle}>Caseworker task tracking system</p>
            </div>
          </div>
          <button
            className={styles.newTaskBtn}
            onClick={() => setShowForm(true)}
          >
            + New Task
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Stats bar */}
        <div className={styles.statsBar}>
          {((['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as FilterStatus[])).map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${filterStatus === s ? styles.filterBtnActive : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              <span className={styles.filterLabel}>
                {s === 'ALL' ? 'All Tasks' : s === 'IN_PROGRESS' ? 'In Progress' : s === 'TODO' ? 'To Do' : 'Done'}
              </span>
              <span className={styles.filterCount}>{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Task form overlay */}
        {showForm && (
          <div className={styles.formOverlay}>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Task grid */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading tasks…</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📋</p>
            <p className={styles.emptyText}>
              {filterStatus === 'ALL' ? 'No tasks yet.' : `No tasks with status "${filterStatus}".`}
            </p>
            {filterStatus === 'ALL' && (
              <button className={styles.newTaskBtn} onClick={() => setShowForm(true)}>
                Create your first task
              </button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      {taskToDelete && (
        <DeleteModal
          task={taskToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
