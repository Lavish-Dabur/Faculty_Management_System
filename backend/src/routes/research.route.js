import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { addResearchProject, deleteResearchProject, listResearchProjects, updateResearchProject } from "../controller/research.controller.js";

const router=express.Router();

router.use(protectRoute);

router.post("/",addResearchProject)
router.get("/",listResearchProjects)
router.put("/:projectID",updateResearchProject)
router.delete("/:projectID",deleteResearchProject)

export default router;