import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('shows validation error when title is empty on submit', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when dueDate is empty on submit', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    await userEvent.type(screen.getByLabelText(/title/i), 'Test task');
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));
    expect(await screen.findByText(/due date is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct payload when form is valid', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText(/title/i), 'Review documents');
    await userEvent.type(screen.getByLabelText(/description/i), 'Check all files');
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-12-01T10:00' },
    });

    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    const call = mockOnSubmit.mock.calls[0][0];
    expect(call.title).toBe('Review documents');
    expect(call.description).toBe('Check all files');
    expect(call.dueDate).toBeDefined();
  });

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText(/title/i), 'Test task');
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-12-01T10:00' },
    });
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe('');
    });
  });
});
