// src/routes/teaching.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  addTeachingExperience, 
  listTeachingExperience, 
  updateTeachingExperience, 
  deleteTeachingExperience 
} from "../controller/teaching.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", addTeachingExperience);
router.get("/", listTeachingExperience);
router.put("/:experienceId", updateTeachingExperience);
router.delete("/:experienceId", deleteTeachingExperience);

export default router;