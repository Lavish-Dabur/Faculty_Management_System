import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { ExportByName } from "../controller/filter.controller.js";

const router = express.Router();

router.get("/export/name", protectRoute,ExportByName);

export default router;