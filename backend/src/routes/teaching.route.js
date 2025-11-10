import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addTeachingExperience,
  deleteTeachingExperience,
  listTeachingExperiences,
  updateTeachingExperience,
  addSubject,
  listSubjects,
  updateSubject,
  deleteSubject
} from "../controller/teaching.controller.js";

const router = express.Router();

router.use(protectRoute);

// Teaching Experience routes
router.post("/", addTeachingExperience);
router.get("/", listTeachingExperiences);
router.put("/:experienceId", updateTeachingExperience);
router.delete("/:experienceId", deleteTeachingExperience);

// Subjects Taught routes
router.post("/subjects", addSubject);
router.get("/subjects", listSubjects);
router.put("/subjects/:subjectId", updateSubject);
router.delete("/subjects/:subjectId", deleteSubject);

export default router;