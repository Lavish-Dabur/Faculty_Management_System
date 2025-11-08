import express from "express";
import { getPendingRequests,approveFaculty,rejectFaculty, addDepartment, getAllDepartments, updateDepartment, deleteDepartment} from "../controller/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/pending", getPendingRequests);
router.put("/approve/:facultyId", approveFaculty);
router.delete("/reject/:facultyId", rejectFaculty);
router.post("/department", addDepartment);
router.get("/department", getAllDepartments);
router.put("/department/:id", updateDepartment);
router.delete("/department/:id", deleteDepartment);

export default router;