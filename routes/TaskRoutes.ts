import { Router } from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  updateTaskStatus,
  createSubTask,
  updateSubTaskStatus,
  taskValidation,
  getCompletedTasksCount 
} from '../controllers/TaskController';
import { protect } from '../middleware/protect';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply protect middleware to all routes
router.use(protect);

// GET /tasks - Get all tasks for the logged-in user
// Optional query param: ?status=todo|in-progress|completed
router.get('/', getTasks);

// GET /tasks/:id - Get a single task by ID
router.get('/:id', getTaskById);

// POST /tasks - Create a new task
router.post(
  '/', 
  validateRequest(taskValidation.create),
  createTask
);
router.post(
  '/:id/subtasks', 
  validateRequest(taskValidation.create),
  createSubTask
);

// PUT /tasks/:id - Update a task
router.put(
  '/:id',
  validateRequest(taskValidation.update),
  updateTask
);

// PATCH /tasks/:id/status - Update task status
router.patch(
  '/:id/status',
  validateRequest(taskValidation.updateStatus),
  updateTaskStatus
);

// PATCH /tasks/:taskId/subtasks/:subTaskId/status - Update subtask status
router.patch(
  '/:id/subtasks/:subTaskId/status',
  validateRequest(taskValidation.updateSubTaskStatus),
  updateSubTaskStatus
);

// DELETE /tasks/:id - Delete a task
router.delete('/:id', deleteTask);

// GET /tasks/stats/completed - Get count of completed tasks
router.get('/stats/completed', getCompletedTasksCount);

export default router;
