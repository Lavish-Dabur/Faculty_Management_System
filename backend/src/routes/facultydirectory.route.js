import express from "express";
import { listFaculty } from "../controller/facultydirectory.controller.js";

const router = express.Router();


router.get("/", listFaculty);

export default router;