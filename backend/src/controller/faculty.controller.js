import prisma from "../utils/db.js"

export const getFacultyProfile = async (req, res) => {
  try {
    // Use FacultyID from params if provided, otherwise from authenticated user
    const facultyId = req.params.FacultyID 
      ? parseInt(req.params.FacultyID) 
      : req.user.FacultyID;

    console.log('getFacultyProfile - FacultyID:', facultyId);

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
      console.log('Faculty not found for ID:', facultyId);
      return res.status(404).json({ message: "Faculty not found" });
    }

    console.log('Faculty found:', faculty.FirstName, faculty.LastName);
    res.status(200).json(faculty);
  } catch (error) {
    console.log("Error in getFacultyProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateFacultyProfile = async (req, res) => {
  try {
    // Use FacultyID from params if provided, otherwise from authenticated user
    const facultyId = req.params.FacultyID 
      ? parseInt(req.params.FacultyID) 
      : req.user.FacultyID;

    console.log('updateFacultyProfile - FacultyID:', facultyId);
    console.log('Update data:', req.body);

    const { 
      FirstName,
      LastName,
      Gender,
      DOB,
      Phone_no,
      SubjectTaught,
      FacultyQualification,
      Awards,
      TeachingExperience,
      CitationMetrics
    } = req.body;

    const updatedFaculty = await prisma.faculty.update({
      where: { FacultyID: facultyId },
      data: {
        FirstName,
        LastName,
        Gender,
        DOB: DOB ? new Date(DOB) : undefined,
        Phone_no,
        SubjectTaught,
        FacultyQualification,
        Awards,
        TeachingExperience,
        CitationMetrics
      },
    });

    console.log('Profile updated successfully for:', updatedFaculty.FirstName, updatedFaculty.LastName);
    res.status(200).json({ message: "Profile updated successfully", faculty: updatedFaculty });
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

export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany({
      where: { isApproved: true },
      include: {
        Department: {
          select: {
            DepartmentName: true
          }
        }
      },
      orderBy: {
        FirstName: 'asc'
      }
    });
    
    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error getting all faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
