import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token faculty ID:", decoded.FacultyID);
    const faculty = await prisma.faculty.findUnique({
      where: { FacultyID: decoded.FacultyID },
      select: { FacultyID: true, isApproved: true }
    });
    console.log("Faculty found:", faculty);

    if (!faculty || !faculty.isApproved) {
      return res.status(401).json({ message: "Unauthorized - Account not approved" });
    }

    req.user = { FacultyID: faculty.FacultyID };
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const protectAdminRoute = async (req, res, next) => {
  try {
    await protectRoute(req, res, async () => {
      const faculty = await prisma.faculty.findUnique({
        where: { FacultyID: req.user.FacultyID },
        select: { Role: true }
      });

      if (!faculty || faculty.Role !== "Admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      next();
    });
  } catch (error) {
    console.error("Error in protectAdminRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};