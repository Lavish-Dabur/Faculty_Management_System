// src/routes/faculty.route.js
import express from "express";
import { getFacultyProfile, updateFacultyProfile, getFacultyById } from "../controller/faculty.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Existing routes
router.get("/getfaculty", protectRoute, getFacultyProfile);
router.put("/updatefaculty", protectRoute, updateFacultyProfile);
router.get("/:id", getFacultyById);

// NEW ROUTE - Get all approved faculty
router.get("/", async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany({
      where: { isApproved: true },
      include: {
        Department: {
          select: {
            DepartmentName: true
          }
        }
      },
      orderBy: {
        FirstName: 'asc'
      }
    });
    
    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error getting all faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;