import express from "express";
import { getFacultyProfile, updateFacultyProfile, getFacultyById } from "../controller/faculty.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/profile/:facultyId", protectRoute, getFacultyProfile);
router.put("/profile/:facultyId", protectRoute, updateFacultyProfile);
router.get("/getfaculty", protectRoute, getFacultyProfile);
router.put("/updatefaculty", protectRoute, updateFacultyProfile);


router.get("/:id", getFacultyById);

export default router;
