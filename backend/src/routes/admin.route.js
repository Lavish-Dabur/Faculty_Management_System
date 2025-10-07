import express from "express";
import { getPendingRequests,approveFaculty,rejectFaculty} from "../controller/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/pending", getPendingRequests);
router.put("/approve/:facultyId", approveFaculty);
router.delete("/reject/:facultyId", rejectFaculty);

export default router;