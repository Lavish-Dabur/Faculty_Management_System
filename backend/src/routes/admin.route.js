import express from "express";
import { 
  getPendingRequests,
  getApprovedFaculty,
  approveFaculty,
  rejectFaculty, 
  addDepartment, 
  getAllDepartments,
  getDepartments,
  updateDepartment, 
  deleteDepartment,
  getDashboardStats
} from "../controller/admin.controller.js";

import { protectAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectAdminRoute);

// Faculty management
router.get("/pending", getPendingRequests);
router.get("/faculty", getApprovedFaculty);
router.put("/approve/:facultyId", approveFaculty);
router.delete("/reject/:facultyId", rejectFaculty);

// Department management
router.get("/departments", getDepartments);
router.get("/department", getAllDepartments);
router.post("/department", addDepartment);
router.put("/department/:id", updateDepartment);
router.delete("/department/:id", deleteDepartment);

// Dashboard stats
router.get("/stats", getDashboardStats);

export default router;