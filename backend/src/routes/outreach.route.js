import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFacultyOutreachActivities, addOutreachActivity, updateOutreachActivity, deleteOutreachActivity } from '../controller/outreach.controller.js';

const router = express.Router();

// protect routes
router.use(protectRoute);

// Get all outreach activities for a faculty member
router.get('/:facultyId', getFacultyOutreachActivities);

// Add a new outreach activity
router.post('/', addOutreachActivity);

// Update an outreach activity
router.put('/:activityId', updateOutreachActivity);

// Delete an outreach activity
router.delete('/:activityId', deleteOutreachActivity);

export default router;