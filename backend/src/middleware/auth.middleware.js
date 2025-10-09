import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt || null;

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
      where: { FacultyID: decoded.FacultyID || decoded.id },
      select: {
        FacultyID: true,
        Role: true,
        isApproved: true,
      },
    });

    if (!faculty) {
      return res.status(401).json({ message: "Unauthorized – Faculty not found" });
    }

    if (!faculty.isApproved) {
      return res.status(403).json({ message: "Faculty not approved yet" });
    }

    if (faculty.Role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized – Admin access required" });
    }

    req.user = faculty;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
