import express from "express";
import { addPublication, listPublications, updatePublication, deletePublication } from "../controller/publication.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protectRoute);

router.post("/", addPublication);
router.get("/", listPublications);
router.put("/:id", updatePublication);
router.delete("/:id", deletePublication);

export default router;
