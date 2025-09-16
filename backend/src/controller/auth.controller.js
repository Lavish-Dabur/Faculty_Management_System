import { generatetoken } from "../utils/jwt.js";
import prisma from "../utils/db.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const signup= async (req,res)=>{
    const { firstName, lastName, gender, dob, role, phone_no, email, password, departmentID } = req.body;
    try {
        if (!firstName || !lastName || !gender || !dob || !role || !phone_no || !email || !password || !departmentID) {
      return res.status(400).json({ message: "All fields are required" });
    }
        if(password.length<6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const existingFaculty = await prisma.faculty.findUnique({ where: { email } });
    if (existingFaculty) {
      return res.status(400).json({ message: "Email already exists" });
    }

        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt);

        const newFaculty = await prisma.faculty.create({
      data: {
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        DOB: new Date(dob),
        Role: role,
        Phone_no: phone_no,
        Email: email,
        DepartmentID: parseInt(departmentID),
        password: hashedPassword,
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
export const login=()=>{

}
export const logout=()=>{

}