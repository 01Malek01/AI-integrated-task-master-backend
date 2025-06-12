import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Task from '../models/Task';
import { body } from 'express-validator';

// @desc    Get all tasks for the logged-in user
// @route   GET /tasks
// @access  Private
export const getTasks = asyncHandler(async (req: any, res: Response) => {
    const { status } = req.query;
    const query: any = { user: req.user._id };
    
    if (status) {
        query.status = status;
    }
    
    const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1 });
    res.json(tasks);
});

// @desc    Get a single task by ID
// @route   GET /tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req: any, res: Response) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    res.json(task);
});

// @desc    Create a new task
// @route   POST /tasks
// @access  Private
export const createTask = asyncHandler(async (req: any, res: Response) => {
    const { title, description, dueDate, priority, status } = req.body;
    
    const task = await Task.create({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        status: status || 'todo',
        user: req.user._id
    });
    
    res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req: any, res: Response) => {
    const { title, description, dueDate, priority, status } = req.body;
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    
    const updatedTask = await task.save();
    
    res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req: any, res: Response) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    await Task.deleteOne({ _id: task._id });
    
    res.json({ message: 'Task removed' });
});

// @desc    Update task status
// @route   PATCH /tasks/:id/status
// @access  Private
export const updateTaskStatus = asyncHandler(async (req: any, res: Response) => {
    const { status } = req.body;
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }
    
    task.status = status || task.status;
    const updatedTask = await task.save();
    
    res.json(updatedTask);
});

// Validation rules for task routes
export const taskValidation = {
    create: [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').optional(),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
        body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
        body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status')
    ],
    update: [
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('description').optional(),
        body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
        body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
        body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status')
    ],
    updateStatus: [
        body('status').isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status')
    ]
};
