// src/routes/faculty.route.js
import express from "express";
import { getFacultyProfile, updateFacultyProfile, getFacultyById, getAllFaculty } from "../controller/faculty.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Existing routes

router.get("/getfaculty", protectRoute, getFacultyProfile);
router.put("/updatefaculty", protectRoute, updateFacultyProfile);

// Get all approved faculty (public route)
router.get("/all", getAllFaculty);

// Get faculty by ID (must be after /all to avoid conflict)
router.get("/:id", getFacultyById);

export default router;