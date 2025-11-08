import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { ExportByName, filterFaculty } from "../controller/filter.controller.js";

const router = express.Router();

router.get("/export/name", protectRoute,ExportByName);
router.get("/", filterFaculty);

export default router;