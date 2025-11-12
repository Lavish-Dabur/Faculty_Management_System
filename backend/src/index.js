import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authroutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import facultyroutes from "./routes/faculty.route.js";
import publicationroutes from "./routes/publication.route.js";
import filterRoutes from "./routes/filter.route.js";
import passwordRoutes from "./routes/password.route.js";
import searchRoutes from "./routes/search.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import patentRoutes from "./routes/patent.route.js";
import teachingRoutes from "./routes/teaching.route.js";
import outreachRoutes from "./routes/outreach.route.js";
import eventRoutes from "./routes/event.route.js";
import citationRoutes from "./routes/citation.route.js";

const app = express();
const server = http.createServer(app);

dotenv.config();
const PORT = process.env.PORT || 5001;

// Body parsers MUST come first
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

app.get('/test',(req, res) => {
    res.send({ "message" : "working"})
})
app.use("/api/auth", authroutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyroutes);
app.use("/api/publications", publicationroutes);
app.use("/api/teaching", teachingRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patent", patentRoutes);
app.use("/api/outreach", outreachRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/citation", citationRoutes);

server.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT);
});