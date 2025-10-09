import jwt from "jsonwebtoken";

const generateToken = (facultyID, role, res) => {
  const token = jwt.sign(
    { 
      FacultyID: facultyID,
      Role: role
    }, 
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "15d" }
  );

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export default generateToken;