// src/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authroutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
<<<<<<< HEAD
import facultyroutes from "./routes/faculty.route.js"
import researchroutes from "./routes/research.route.js"
import publicationroutes from "./routes/publication.route.js"
import filterRoutes from "./routes/filter.route.js"
import passwordRoutes from "./routes/password.route.js";
import searchRoutes from "./routes/search.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import patentRoutes from "./routes/patent.route.js";
import teachingRoutes from "./routes/teaching.route.js";
import awardRoutes from "./routes/award.route.js";
import outreachRoutes from "./routes/outreach.route.js";
import eventRoutes from "./routes/event.route.js";
import qualificationRoutes from "./routes/qualification.route.js";
import citationRoutes from "./routes/citation.route.js";
=======
import facultyroutes from "./routes/faculty.route.js";
import researchroutes from "./routes/research.route.js";
import publicationroutes from "./routes/publication.route.js";
import awardsRoutes from "./routes/awards.route.js";
import qualificationsRoutes from "./routes/qualifications.route.js";
import teachingRoutes from "./routes/teaching.route.js";
>>>>>>> 473c7d5180dbebce149ceda5585ae99cb76d2f3d

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

dotenv.config();
<<<<<<< HEAD
=======
const PORT = process.env.PORT || 5001;
>>>>>>> 473c7d5180dbebce149ceda5585ae99cb76d2f3d

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

<<<<<<< HEAD
app.use("/api/auth",authroutes)
app.use("/api/admin", adminRoutes)
app.use("/api/faculty",facultyroutes)
app.use("/api/faculty/research",researchroutes)
app.use("/api/faculty/publication",publicationroutes)
app.use("/api/faculty/patents", patentRoutes)
app.use("/api/faculty/teaching", teachingRoutes)
app.use("/api/faculty/awards", awardRoutes)
app.use("/api/faculty/outreach", outreachRoutes)
app.use("/api/faculty/events", eventRoutes)
app.use("/api/faculty/qualifications", qualificationRoutes)
app.use("/api/faculty/citations", citationRoutes)
app.use("/api/retreive/",filterRoutes)
app.use("/api/password", passwordRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);


server.listen(PORT,()=>{
    console.log("server is running on PORT "+PORT);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
=======
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
>>>>>>> 473c7d5180dbebce149ceda5585ae99cb76d2f3d
});