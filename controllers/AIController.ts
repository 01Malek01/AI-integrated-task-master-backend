import asyncHandler from 'express-async-handler';
import { AI_summarize } from '../lib/AI-summarize-texts';
import { AI_assistant } from '../lib/AI_assistant';
import { AI_generateSubtasks } from '../lib/AI-generateSubTasks';
import { Request, Response, NextFunction } from 'express';

// @desc    Summarize text
// @route   POST /ai/summarize
// @access  Private
export const summarizeTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body;
    const summary = await AI_summarize(text);
    res.json({ summary });
});

// @desc    Get AI assistant response
// @route   POST /ai/assistant
// @access  Private
export const assistantResponse = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }
    const response = await AI_assistant(message);
    res.json({ response });
});

// @desc    Generate subtasks for a task
// @route   POST /ai/generate-subtasks
// @access  Private
export const generateSubtasks = asyncHandler(async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) {
        res.status(400);
        throw new Error('Task title is required');
    }
    const subtasks = await AI_generateSubtasks(title);
    res.json({ subtasks });
});
