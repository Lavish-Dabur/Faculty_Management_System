import { generatetoken } from "../utils/jwt.js";
import prisma from "../utils/db.js"
import bcrypt from "bcryptjs";

export const signup= async (req,res)=>{
    const { firstName, lastName, gender, dob, role, phone_no, email, password, departmentID ,departmentName} = req.body;
    try {
        if (!firstName || !lastName || !gender || !dob || !role || !phone_no || !email || !password || !departmentName) {
      return res.status(400).json({ message: "All fields are required" });
    }
        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const existingFaculty = await prisma.faculty.findUnique({ where: { Email:email } });
    if (existingFaculty) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);

        const newFaculty = await prisma.faculty.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        DOB: new Date(dob),
        Role: role,
        Phone_no: phone_no,
        Email: email,
        Department: {
      connectOrCreate: {
        where: { DepartmentName: departmentName },
        create: { DepartmentName: departmentName },
      },
    },
        Password: hashedPassword,
      }
    });

    generatetoken(newFaculty.FacultyID, res);


    res.status(201).json({
      FacultyID: newFaculty.FacultyID,
      FirstName: newFaculty.FirstName,
      LastName: newFaculty.LastName,
      Email: newFaculty.Email,
      Role: newFaculty.Role,
    });
        
    } catch (error) {
        console.log("Error in signup controller ",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};



export const login= async (req,res)=>{
    const {email,password}=req.body
    try {
        const faculty = await prisma.faculty.findUnique({ where: { Email: email } });

        if (!faculty) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
        const isPasswordCorrect = await bcrypt.compare(password, faculty.Password);

        if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        generatetoken(faculty.FacultyID, res);

        res.status(200).json({
      FacultyID: faculty.FacultyID,
      FirstName: faculty.FirstName,
      LastName: faculty.LastName,
      Email: faculty.Email,
      Role: faculty.Role,
    });
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Looged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}




export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}