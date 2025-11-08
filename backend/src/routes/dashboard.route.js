import express from 'express';
import { getDashboardStats } from '../controller/dashboard.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard-stats/:facultyId', protectRoute, getDashboardStats);

export default router;