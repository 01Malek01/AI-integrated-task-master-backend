import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Note from '../models/Note.js';
import { body } from 'express-validator';

// @desc    Get all notes for the logged-in user
// @route   GET /notes
// @access  Private
export const getNotes = asyncHandler(async (req: any, res: Response) => {
    const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
});

// @desc    Get a single note by ID
// @route   GET /notes/:id
// @access  Private
export const getNoteById = asyncHandler(async (req: any, res: Response) => {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!note) {
        res.status(404);
        throw new Error('Note not found');
    }
    
    res.json(note);
});

// @desc    Create a new note
// @route   POST /notes
// @access  Private
export const createNote = asyncHandler(async (req: any, res: Response) => {
    const { title, content , category } = req.body;
    
    const note = await Note.create({
        title,
        content,
        category,       
        userId: req.user._id
    });
    
    res.status(201).json(note);
});

// @desc    Update a note
// @route   PUT /notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req: any, res: Response) => {
    const { title, content , category } = req.body;
    
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!note) {
        res.status(404);
        throw new Error('Note not found');
    }
    
    note.title = title || note.title;
    note.content = content || note.content;
    note.category = category || note.category;    
    const updatedNote = await note.save();
    
    res.json(updatedNote);
});

// @desc    Delete a note
// @route   DELETE /notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req: any, res: Response) => {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!note) {
        res.status(404);
        throw new Error('Note not found');
    }
    
    await Note.deleteOne({ _id: note._id });
    
    res.json({ message: 'Note removed' });
});

// Validation rules for note routes
// @desc    Get count of notes for the logged-in user
// @route   GET /notes/stats/count
// @access  Private
export const getNotesCount = asyncHandler(async (req: any, res: Response) => {
    const count = await Note.countDocuments({ userId: req.user._id });
    res.json({ count });
});

export const noteValidation = {
    create: [
        body('title').notEmpty().withMessage('Title is required'),
        body('content').notEmpty().withMessage('Content is required'), 
        body('category').optional().isString().withMessage('Invalid category')
    ],
    update: [
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().notEmpty().withMessage('Content cannot be empty'),
        body('category').optional().isString().withMessage('Invalid category')
    ]
};
