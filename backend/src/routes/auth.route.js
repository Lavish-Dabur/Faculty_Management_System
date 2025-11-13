import express from "express";
import { login, logout, signup, getPublicDepartments } from "../controller/auth.controller.js";

const router=express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

// Public endpoint for departments (no auth required)
router.get("/departments",getPublicDepartments)

export default router;