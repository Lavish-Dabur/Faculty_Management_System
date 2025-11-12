import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { ExportByName, filterFaculty } from "../controller/filter.controller.js";

const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: "Filter route is working!" });
});

router.get("/export/name", protectRoute, ExportByName);
router.get("/", filterFaculty);

export default router;