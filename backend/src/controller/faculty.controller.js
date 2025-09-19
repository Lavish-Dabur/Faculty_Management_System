import prisma from "../utils/db.js"

export const getFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;

    const faculty = await prisma.faculty.findUnique({
      where: { FacultyID: facultyId },
      select: {
        FacultyID: true,
        FirstName: true,
        LastName: true,
        Gender: true,
        DOB: true,
        Role: true,
        Phone_no: true,
        Email: true,
        Department: {
          select: {
            DepartmentName: true,
          },
        },
        
        SubjectTaught: true,
        FacultyQualification: true,
        Awards: true,
        TeachingExperience: true,
        CitationMetrics: true,
        ResearchProjects: true,
        
      },
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty);
  } catch (error) {
    console.log("Error in getFacultyProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateFacultyProfile = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { firstName, lastName, gender, dob, role, phone_no } = req.body;

    if (!firstName || !lastName || !gender || !role || !phone_no) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const updatedFaculty = await prisma.faculty.update({
      where: { FacultyID: facultyId },
      data: {
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        DOB: dob ? new Date(dob) : undefined,
        Role: role,
        Phone_no: phone_no,
      },
      select: {
        FacultyID: true,
        FirstName: true,
        LastName: true,
        Gender: true,
        DOB: true,
        Role: true,
        Phone_no: true,
        Email: true,
        Department: {
          select: {
            DepartmentName: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      faculty: updatedFaculty,
    });
  } catch (error) {
    console.log("Error in updateFacultyProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid faculty ID" });
    }

    const facultyId = parseInt(id);

    const faculty = await prisma.faculty.findUnique({
      where: { FacultyID: parseInt(id) },
      select: {
        FacultyID: true,
        FirstName: true,
        LastName: true,
        Gender: true,
        Role: true,
        Phone_no: true,
        Email: true,
        Department: {
          select: {
            DepartmentName: true,
          },
        },

        SubjectTaught: true,
        Awards: true,
        ResearchProjects: true,
        FacultyPublicationLink: {
          include: {
            Publication: {
              select: {
                Title: true,
                PublicationYear: true,
                Type: true,
              },
            },
          },
        },
  
      },
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty);
  } catch (error) {
    console.log("Error in getFacultyById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
