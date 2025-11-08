import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  addQualification, 
  listQualifications, 
  updateQualification, 
  deleteQualification 
} from "../controller/qualifications.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", addQualification);
router.get("/", listQualifications);
router.put("/:qualificationId", updateQualification);
router.delete("/:qualificationId", deleteQualification);

export default router;