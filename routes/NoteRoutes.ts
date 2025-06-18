import { Router } from 'express';
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote,
  noteValidation,
  getNotesCount 
} from '../controllers/NoteController';
import { protect } from '../middleware/protect';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply protect middleware to all routes
router.use(protect);

// GET /notes - Get all notes for the logged-in user
router.get('/', getNotes);

// GET /notes/:id - Get a single note by ID
router.get('/:id', getNoteById);

// POST /notes - Create a new note
router.post(
  '/', 
  validateRequest(noteValidation.create),
  createNote
);

// PUT /notes/:id - Update a note
router.put(
  '/:id',
  validateRequest(noteValidation.update),
  updateNote
);

// DELETE /notes/:id - Delete a note
router.delete('/:id', deleteNote);

// GET /notes/stats/count - Get count of notes
router.get('/stats/count', getNotesCount);

export default router;
