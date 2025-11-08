import express from "express";
<<<<<<< HEAD
import { getPendingRequests,approveFaculty,rejectFaculty, addDepartment, getAllDepartments, updateDepartment, deleteDepartment} from "../controller/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
=======
import { 
  getPendingRequests, 
  approveFaculty, 
  rejectFaculty, 
  getDashboardStats,
  getApprovedFaculty,
  getDepartments,
  addDepartment,
  deleteDepartment
} from "../controller/admin.controller.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
>>>>>>> 473c7d5180dbebce149ceda5585ae99cb76d2f3d

const router = express.Router();

router.use(protectAdminRoute);

// Faculty management
router.get("/pending", getPendingRequests);
router.get("/faculty", getApprovedFaculty);
router.put("/approve/:facultyId", approveFaculty);
router.delete("/reject/:facultyId", rejectFaculty);
router.post("/department", addDepartment);
router.get("/department", getAllDepartments);
router.put("/department/:id", updateDepartment);
router.delete("/department/:id", deleteDepartment);

// Department management
router.get("/departments", getDepartments);
router.post("/departments", addDepartment);
router.delete("/departments/:departmentId", deleteDepartment);

// Dashboard
router.get("/stats", getDashboardStats);

export default router;