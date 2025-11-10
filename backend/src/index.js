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
import filterRoutes from "./routes/filter.route.js";
import passwordRoutes from "./routes/password.route.js";
import searchRoutes from "./routes/search.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import patentRoutes from "./routes/patent.route.js";
import teachingRoutes from "./routes/teaching.route.js";
import awardRoutes from "./routes/award.route.js";
import awardsRoutes from "./routes/awards.route.js";
import outreachRoutes from "./routes/outreach.route.js";
import eventRoutes from "./routes/event.route.js";
import qualificationRoutes from "./routes/qualification.route.js";
import qualificationsRoutes from "./routes/qualifications.route.js";
import citationRoutes from "./routes/citation.route.js";

const app = express();
const server = http.createServer(app);

dotenv.config();
const PORT = process.env.PORT || 5001;

// CORS - Allow React dev server
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.get('/test',(req, res) => {
    res.send({ "message" : "working"})
})

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authroutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyroutes);
app.use("/api/faculty/research", researchroutes);
app.use("/api/faculty/publication", publicationroutes);
app.use("/api/faculty/patents", patentRoutes);
app.use("/api/faculty/teaching", teachingRoutes);
app.use("/api/faculty/awards", awardRoutes);
app.use("/api/faculty/outreach", outreachRoutes);
app.use("/api/faculty/events", eventRoutes);
app.use("/api/faculty/qualifications", qualificationRoutes);
app.use("/api/faculty/citations", citationRoutes);
app.use("/api/retreive/", filterRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/research", researchroutes);
app.use("/api/publications", publicationroutes);
app.use("/api/awards", awardsRoutes);
app.use("/api/qualifications", qualificationsRoutes);
app.use("/api/teaching", teachingRoutes);

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on PORT ${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop other instances or set a different PORT in .env`);
    } else {
        console.error('Server error:', err && err.stack ? err.stack : err);
    }
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason && reason.stack ? reason.stack : reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});