import generateToken from "../utils/jwt.js";
import prisma from "../utils/db.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, gender, departmentName, dob, role } = req.body;
  try {
    console.log("Signup request received:", { email, role });
    
    if (!firstName || !lastName || !role || !dob || !email || !password || !departmentName) {
      return res.status(400).json({ message: "All fields are required" });
    } 
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingFaculty = await prisma.faculty.findUnique({ where: { Email: email } });
    if (existingFaculty) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newFaculty = await prisma.faculty.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        DOB: new Date(dob),
        Role: role,
        Phone_no: "",
        Email: email,
        isApproved: role === "Admin" ? true : false,
        Department: {
          connectOrCreate: {
            where: { DepartmentName: departmentName },
            create: { DepartmentName: departmentName },
          },
        },
        Password: hashedPassword,
      }
    });

    console.log("Faculty created:", newFaculty.FacultyID);

    const token = generateToken(newFaculty.FacultyID, newFaculty.Role, res);

    res.status(201).json({
      token,
      ...(newFaculty.Role === "Faculty" && { message: "Signup request submitted! Please wait for admin approval." }),
      FacultyID: newFaculty.FacultyID,
      FirstName: newFaculty.FirstName,
      LastName: newFaculty.LastName,
      Email: newFaculty.Email,
      Role: newFaculty.Role,
    });

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const faculty = await prisma.faculty.findUnique({ where: { Email: email } });
    if (!faculty) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, faculty.Password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!faculty.isApproved && faculty.Role === "Faculty") {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    const token = generateToken(faculty.FacultyID, faculty.Role, res);

    res.status(200).json({
      token,
      FacultyID: faculty.FacultyID,
      FirstName: faculty.FirstName,
      LastName: faculty.LastName,
      Email: faculty.Email,
      Role: faculty.Role,
    });

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

<<<<<<< HEAD
export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
=======
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
>>>>>>> 4fcf47e2a3b9b76e77393e3464173066888e60d1

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};