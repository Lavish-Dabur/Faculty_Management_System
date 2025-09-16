import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";

export const protectRoute=async(req,res,next)=>{
    try {
        const token =req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Unauthorized-No Token Provided"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"Unauthorized-Invalid Token"})
        }

        const faculty = await prisma.faculty.findUnique({
      where: { FacultyID: decoded.FacultyID },
      select: {
        FacultyID: true,
        FirstName: true,
        LastName: true,
        Email: true,
        Role: true,
        
      },
    });

    if (!faculty) {
      return res.status(401).json({ message: "Faculty not found" });
    }

    req.user = faculty;

    next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}