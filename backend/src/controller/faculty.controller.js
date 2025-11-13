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

    // Validate DOB is not in the future if provided
    if (req.body.DOB) {
      const dobDate = new Date(req.body.DOB);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dobDate > today) {
        return res.status(400).json({ message: "Date of Birth cannot be in the future" });
      }
    }

    const { 
      FirstName,
      LastName,
      Gender,
      DOB,
      Phone_no,
      Role,
      SubjectTaught,
      FacultyQualification,
      Awards,
      TeachingExperience,
      CitationMetrics
    } = req.body;

    // Build update data object, only including defined fields
    const updateData = {};
    if (FirstName !== undefined) updateData.FirstName = FirstName;
    if (LastName !== undefined) updateData.LastName = LastName;
    if (Gender !== undefined) updateData.Gender = Gender;
    if (DOB !== undefined) updateData.DOB = new Date(DOB);
    if (Phone_no !== undefined) updateData.Phone_no = Phone_no;
    if (Role !== undefined) updateData.Role = Role;
    if (SubjectTaught !== undefined) updateData.SubjectTaught = SubjectTaught;
    if (FacultyQualification !== undefined) updateData.FacultyQualification = FacultyQualification;
    if (Awards !== undefined) updateData.Awards = Awards;
    if (TeachingExperience !== undefined) updateData.TeachingExperience = TeachingExperience;
    if (CitationMetrics !== undefined) updateData.CitationMetrics = CitationMetrics;

    const updatedFaculty = await prisma.faculty.update({
      where: { FacultyID: facultyId },
      data: updateData,
    });

    console.log('Profile updated successfully for:', updatedFaculty.FirstName, updatedFaculty.LastName);
    res.status(200).json({ message: "Profile updated successfully", faculty: updatedFaculty });
  } catch (error) {
    console.error("Error in updateFacultyProfile controller:", error);
    
    // Send more detailed error messages
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Faculty not found" });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Duplicate entry. Please check your data." });
    }
    
    res.status(500).json({ 
      message: error.message || "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
        FacultyQualification: true,
        Awards: true,
        TeachingExperience: true,
        ResearchProjects: true,
        EventsOrganised: true,
        OutReachActivities: true,
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
      where: { 
        isApproved: true,
        Role: { not: 'Admin' }
      },
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
