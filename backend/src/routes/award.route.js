import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFacultyAwards, addAward, updateAward, deleteAward } from '../controller/award.controller.js';

const router = express.Router();

// protect all award routes
router.use(protectRoute);

// Get all awards for a faculty member
router.get('/:facultyId', getFacultyAwards);

// Add a new award
router.post('/', addAward);

// Update an award
router.put('/:awardId', updateAward);

// Delete an award
router.delete('/:awardId', deleteAward);

export default router;