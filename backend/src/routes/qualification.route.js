import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getFacultyQualifications, addQualification, updateQualification, deleteQualification } from '../controller/qualification.controller.js';

const router = express.Router();

router.use(protectRoute);

// Get all qualifications for a faculty member
router.get('/:facultyId', getFacultyQualifications);

// Add a new qualification
router.post('/', addQualification);

// Update a qualification
router.put('/:qualificationId', updateQualification);

// Delete a qualification
router.delete('/:qualificationId', deleteQualification);

export default router;