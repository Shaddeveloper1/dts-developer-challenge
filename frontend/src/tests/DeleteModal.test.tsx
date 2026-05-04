import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DeleteModal } from '../components/DeleteModal';
import { Task } from '../types/task';

const mockTask: Task = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Review case file',
  status: 'TODO',
  dueDate: '2025-06-01T09:00:00.000Z',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('DeleteModal', () => {
  it('renders task title in confirmation message', () => {
    render(
      <DeleteModal task={mockTask} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByText(/review case file/i)).toBeInTheDocument();
  });

  it('calls onConfirm when delete button clicked', async () => {
    const onConfirm = vi.fn();
    render(<DeleteModal task={mockTask} onConfirm={onConfirm} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', async () => {
    const onCancel = vi.fn();
    render(<DeleteModal task={mockTask} onConfirm={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('has correct aria attributes for accessibility', () => {
    render(
      <DeleteModal task={mockTask} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
