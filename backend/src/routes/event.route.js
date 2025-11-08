import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFacultyEvents, getEventTypes, addEvent, updateEvent, deleteEvent } from '../controller/event.controller.js';

const router = express.Router();

// protect all event routes
router.use(protectRoute);

// Place specific routes before parameterized ones
router.get('/types', getEventTypes);
router.get('/:facultyId', getFacultyEvents);

// Add a new event
router.post('/', addEvent);

// Update an event
router.put('/:eventId', updateEvent);

// Delete an event
router.delete('/:eventId', deleteEvent);

export default router;