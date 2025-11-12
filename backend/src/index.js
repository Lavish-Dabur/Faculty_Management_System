// src/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authroutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import facultyroutes from "./routes/faculty.route.js";
import researchroutes from "./routes/research.route.js";
import publicationroutes from "./routes/publication.route.js";
import awardsRoutes from "./routes/awards.route.js";
import qualificationsRoutes from "./routes/qualifications.route.js";
import teachingRoutes from "./routes/teaching.route.js";

const app = express();
// const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

dotenv.config();
const PORT = process.env.PORT || 5001;

// UPDATED CORS - Allow both common React ports
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// UPDATED Test endpoint with proper API path
app.get('/test', (req, res) => {
    res.json({ "message": "Backend is working!", "port": PORT });
});

app.use(express.json());
app.use(cookieParser());

// UPDATED Routes - Removed /faculty prefix from some routes
app.use("/api/auth", authroutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyroutes);
app.use("/api/research", researchroutes); // Removed /faculty
app.use("/api/publications", publicationroutes); // Removed /faculty  
app.use("/api/awards", awardsRoutes); // Removed /faculty
app.use("/api/qualifications", qualificationsRoutes); // Removed /faculty
app.use("/api/teaching", teachingRoutes); // Removed /faculty

server.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT);
});