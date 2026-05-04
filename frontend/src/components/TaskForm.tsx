import React, { useState } from 'react';
import { CreateTaskPayload, VALID_STATUSES, STATUS_LABELS } from '../types/task';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_FORM: CreateTaskPayload = {
  title: '',
  description: '',
  status: 'TODO',
  dueDate: '',
};

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<CreateTaskPayload>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskPayload, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }
    if (form.description && form.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }
    if (!form.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateTaskPayload]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: CreateTaskPayload = {
        title: form.title.trim(),
        dueDate: new Date(form.dueDate).toISOString(),
        status: form.status,
      };
      if (form.description?.trim()) {
        payload.description = form.description.trim();
      }
      await onSubmit(payload);
      setForm(DEFAULT_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <h2 className={styles.heading}>Create New Task</h2>

      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="e.g. Review case documents"
          maxLength={255}
          disabled={submitting}
        />
        {errors.title && <p className={styles.errorMsg}>{errors.title}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="Optional description..."
          rows={3}
          maxLength={1000}
          disabled={submitting}
        />
        {errors.description && <p className={styles.errorMsg}>{errors.description}</p>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className={styles.select}
            disabled={submitting}
          >
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="dueDate" className={styles.label}>
            Due date &amp; time <span className={styles.required}>*</span>
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            value={form.dueDate}
            onChange={handleChange}
            className={`${styles.input} ${errors.dueDate ? styles.inputError : ''}`}
            disabled={submitting}
          />
          {errors.dueDate && <p className={styles.errorMsg}>{errors.dueDate}</p>}
        </div>
      </div>

      <div className={styles.buttons}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
