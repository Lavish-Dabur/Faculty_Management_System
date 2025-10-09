import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  addAward, 
  listAwards, 
  updateAward, 
  deleteAward 
} from "../controller/awards.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", addAward);
router.get("/", listAwards);
router.put("/:awardId", updateAward);
router.delete("/:awardId", deleteAward);

export default router;