import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import authroutes from "./routes/auth.route.js";


const app = express();
const server = http.createServer(app);


dotenv.config();
const PORT=process.env.PORT

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}
))

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authroutes)

server.listen(PORT,()=>{
    console.log("server is running on PORT "+PORT);
});