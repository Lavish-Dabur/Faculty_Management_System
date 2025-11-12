<<<<<<< HEAD
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
=======
// src/routes/teaching.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  addTeachingExperience, 
  listTeachingExperience, 
  updateTeachingExperience, 
  deleteTeachingExperience 
>>>>>>> 473c7d5180dbebce149ceda5585ae99cb76d2f3d
} from "../controller/teaching.controller.js";

const router = express.Router();

router.use(protectRoute);

<<<<<<< HEAD
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

=======
router.post("/", addTeachingExperience);
router.get("/", listTeachingExperience);
router.put("/:experienceId", updateTeachingExperience);
router.delete("/:experienceId", deleteTeachingExperience);

>>>>>>> 473c7d5180dbebce149ceda5585ae99cb76d2f3d
export default router;