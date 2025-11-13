import generateToken from "../utils/jwt.js";
import prisma from "../utils/db.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, gender, departmentName, dob, role, phone_no } = req.body;
  try {
    if (!firstName || !lastName || !role || !dob || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    
    if (role === 'Faculty' && !departmentName) {
      return res.status(400).json({ message: "Department is required for Faculty role" });
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

    const facultyData = {
      FirstName: firstName,
      LastName: lastName,
      Gender: gender,
      DOB: new Date(dob),
      Role: role,
      Phone_no: phone_no || "",
      Email: email,
      isApproved: role === 'Admin' ? true : false, // Admin signups are auto-approved
      Password: hashedPassword,
    };
    
    if (role === 'Faculty' && departmentName) {
      facultyData.Department = {
        connectOrCreate: {
          where: { DepartmentName: departmentName },
          create: { DepartmentName: departmentName },
        },
      };
    }

    const newFaculty = await prisma.faculty.create({
      data: facultyData
    });

    const token = generateToken(newFaculty.FacultyID, newFaculty.Role, res);

    res.status(201).json({
      token,
      message: "Signup request submitted! Please wait for admin approval.",
      FacultyID: newFaculty.FacultyID,
      FirstName: newFaculty.FirstName,
      LastName: newFaculty.LastName,
      Email: newFaculty.Email,
      Role: newFaculty.Role,
    });

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for:', email);
    
    const faculty = await prisma.faculty.findUnique({ where: { Email: email } });
    
    if (!faculty) {
      console.log('User not found:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log('User found:', faculty.Email, 'Role:', faculty.Role, 'isApproved:', faculty.isApproved);

    const isPasswordCorrect = await bcrypt.compare(password, faculty.Password);
    if (!isPasswordCorrect) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!faculty.isApproved) {
      console.log('Account not approved:', email);
      return res.status(403).json({ message: "Your account is pending admin approval. Please wait for approval." });
    }

    const token = generateToken(faculty.FacultyID, faculty.Role, res);
    
    console.log('Login successful for:', email);

    res.status(200).json({
      token,
      FacultyID: faculty.FacultyID,
      FirstName: faculty.FirstName,
      LastName: faculty.LastName,
      Email: faculty.Email,
      Role: faculty.Role,
    });

  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};