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
import searchRoutes from "./routes/search.route.js";

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
app.use("/api/search", searchRoutes);

server.listen(PORT, '0.0.0.0', () => {
    const addr = server.address();
    if (addr) {
        console.log(`Server is running and bound to ${addr.address}:${addr.port}`);
    } else {
        console.log(`Server is running on PORT ${PORT}`);
    }
});

// Handle server errors (e.g. port already in use)
server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. If you have another instance running, stop it or set a different PORT in .env before starting.`);
    } else {
        console.error('Server error:', err && err.stack ? err.stack : err);
    }
    // Don't exit immediately - keep process alive for debugging
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection at:', reason && reason.stack ? reason.stack : reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err && err.stack ? err.stack : err);
    // Don't exit immediately so we can inspect logs; if you want to exit in production, change this behavior.
});