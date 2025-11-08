import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    getFacultyCitationMetrics,
    getLatestCitationMetrics,
    addCitationMetrics,
    updateCitationMetrics,
    deleteCitationMetrics
} from '../controller/citation.controller.js';

const router = express.Router();

// protect all citation routes
router.use(protectRoute);

// Place more specific route first to avoid route conflicts
router.get('/latest/:facultyId', getLatestCitationMetrics);
router.get('/:facultyId', getFacultyCitationMetrics);

// Add new citation metrics
router.post('/', addCitationMetrics);

// Update citation metrics
router.put('/:metricsId', updateCitationMetrics);

// Delete citation metrics
router.delete('/:metricsId', deleteCitationMetrics);

export default router;