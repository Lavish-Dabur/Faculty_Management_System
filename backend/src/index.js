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
import teachingRoutes from "./routes/teaching.route.js";

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
app.use("/api/research", researchroutes); // Removed /faculty
app.use("/api/publications", publicationroutes); // Removed /faculty  
app.use("/api/awards", awardsRoutes); // Removed /faculty
app.use("/api/qualifications", qualificationsRoutes); // Removed /faculty
app.use("/api/teaching", teachingRoutes); // Removed /faculty

server.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT);
});