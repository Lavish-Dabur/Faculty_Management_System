import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authroutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import facultyroutes from "./routes/faculty.route.js"
import researchroutes from "./routes/research.route.js"
import publicationroutes from "./routes/pulication.route.js"
import filterRoutes from "./routes/filter.route.js"

const app = express();
const server = http.createServer(app);


dotenv.config();
const PORT=process.env.PORT

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
))

app.get('/test',(req, res) => {
    res.send({ "message" : "working"})
})

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authroutes)
app.use("/api/admin", adminRoutes)
app.use("/api/faculty",facultyroutes)
app.use("/api/faculty/research",researchroutes)
app.use("/api/faculty/publication",publicationroutes)
app.use("/api/retreive/",filterRoutes)




server.listen(PORT,()=>{
    console.log("server is running on PORT "+PORT);
});