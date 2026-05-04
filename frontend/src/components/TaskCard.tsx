import React, { useState } from 'react';
import { Task, TaskStatus, STATUS_LABELS, STATUS_COLOURS, STATUS_TEXT_COLOURS, VALID_STATUSES } from '../types/task';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdating(true);
    await onStatusChange(task.id, e.target.value as TaskStatus);
    setUpdating(false);
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <div className={styles.card} style={{ borderLeft: `4px solid ${STATUS_TEXT_COLOURS[task.status]}` }}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(task)}
          aria-label={`Delete task: ${task.title}`}
          title="Delete task"
        >
          ×
        </button>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.meta}>
        <span
          className={styles.statusBadge}
          style={{
            backgroundColor: STATUS_COLOURS[task.status],
            color: STATUS_TEXT_COLOURS[task.status],
          }}
        >
          {STATUS_LABELS[task.status]}
        </span>

        <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
          Due: {new Date(task.dueDate).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
          {isOverdue && <span className={styles.overdueLabel}> Overdue</span>}
        </span>
      </div>

      <div className={styles.actions}>
        <label htmlFor={`status-${task.id}`} className={styles.selectLabel}>
          Update status:
        </label>
        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={handleStatusChange}
          disabled={updating}
          className={styles.statusSelect}
        >
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
