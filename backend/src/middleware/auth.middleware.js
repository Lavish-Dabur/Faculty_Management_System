import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";

export const protectRoute = async (req, res, next) => {
  try {

    let token = req.cookies.jwt;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized – No token provided" });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Unauthorized – Invalid token" });
    }

    const faculty = await prisma.faculty.findUnique({
      where: { FacultyID: decoded.FacultyID },
      select: { FacultyID: true }
    });
    if (!faculty) {
      return res.status(401).json({ message: "Unauthorized – Faculty not found" });
    }

    req.user = { FacultyID: faculty.FacultyID };
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
