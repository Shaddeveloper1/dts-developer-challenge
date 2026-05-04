import React from 'react';
import { Task } from '../types/task';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  task: Task;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ task, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className={styles.modal}>
        <h2 id="delete-modal-title" className={styles.title}>Delete Task</h2>
        <p className={styles.body}>
          Are you sure you want to delete <strong>"{task.title}"</strong>?
          This action cannot be undone.
        </p>
        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
