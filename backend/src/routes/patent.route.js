import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addPatent, deletePatent, listPatents, updatePatent } from "../controller/patent.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/", addPatent);
router.get("/", listPatents);
router.put("/:patentId", updatePatent);
router.delete("/:patentId", deletePatent);

export default router;