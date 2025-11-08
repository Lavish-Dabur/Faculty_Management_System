import express from "express";
import { searchFaculty } from "../controller/search.controller.js";

const router = express.Router();

router.get("/", searchFaculty);

export default router;