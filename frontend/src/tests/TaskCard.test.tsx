import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types/task';

const mockTask: Task = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Review case file',
  description: 'Check all documents are in order',
  status: 'TODO',
  dueDate: '2099-06-01T09:00:00.000Z',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskCard', () => {
  const mockOnStatusChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task title and description', () => {
    render(
      <TaskCard task={mockTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );
    expect(screen.getByText('Review case file')).toBeInTheDocument();
    expect(screen.getByText('Check all documents are in order')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(
      <TaskCard task={mockTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );
    expect(screen.getAllByText('To Do')[0]).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <TaskCard task={mockTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );
    await userEvent.click(screen.getByRole('button', { name: /delete task/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask);
  });

  it('calls onStatusChange when status select changes', async () => {
    mockOnStatusChange.mockResolvedValue(undefined);
    render(
      <TaskCard task={mockTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      'IN_PROGRESS'
    );

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith(mockTask.id, 'IN_PROGRESS');
    });
  });

  it('shows overdue indicator for past due tasks', () => {
    const overdueTask: Task = {
      ...mockTask,
      status: 'TODO',
      dueDate: '2020-01-01T00:00:00.000Z',
    };
    render(
      <TaskCard task={overdueTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it('does not show overdue for DONE tasks past due date', () => {
    const doneTask: Task = {
      ...mockTask,
      status: 'DONE',
      dueDate: '2020-01-01T00:00:00.000Z',
    };
    render(
      <TaskCard task={doneTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );
    expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const noDescTask: Task = { ...mockTask, description: undefined };
    render(
      <TaskCard task={noDescTask} onStatusChange={mockOnStatusChange} onDelete={mockOnDelete} />
    );
    expect(screen.queryByText('Check all documents are in order')).not.toBeInTheDocument();
  });
});
