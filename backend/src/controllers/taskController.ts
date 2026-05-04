import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import * as TaskModel from '../models/taskModel';

export function getAllTasks(req: Request, res: Response, next: NextFunction): void {
  try {
    const tasks = TaskModel.getAllTasks();
    res.json({ success: true, data: tasks, count: tasks.length });
  } catch (err) {
    next(err);
  }
}

export function getTaskById(req: Request, res: Response, next: NextFunction): void {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      return;
    }
    const task = TaskModel.getTaskById(req.params.id);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export function createTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      return;
    }
    const task = TaskModel.createTask(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export function updateTaskStatus(req: Request, res: Response, next: NextFunction): void {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      return;
    }
    const task = TaskModel.updateTaskStatus(req.params.id, req.body);
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export function deleteTask(req: Request, res: Response, next: NextFunction): void {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      return;
    }
    const deleted = TaskModel.deleteTask(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
