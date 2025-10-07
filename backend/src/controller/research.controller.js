import prisma from "../utils/db.js";

export const addResearchProject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { title, fundingAgency, startDate, endDate, budget, typeID } = req.body;

    if (!title || !startDate || !typeID) {
      return res.status(400).json({ message: "Title, startDate, and typeID are required" });
    }

    const project = await prisma.researchProjects.create({
      data: {
        Title: title,
        FundingAgency: fundingAgency,
        StartDate: new Date(startDate),
        EndDate: endDate ? new Date(endDate) : null,
        Budget: budget ? Number(budget) : null,
        FacultyID: facultyId,  
        TypeID: typeID,        
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error adding research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listResearchProjects = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    if (isNaN(facultyId)) {
      return res.status(400).json({ message: "Invalid faculty ID" });
    }
    const projects = await prisma.researchProjects.findMany({
      where: { FacultyID: facultyId },
      orderBy: { StartDate: "desc" },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error listing research projects:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateResearchProject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { typeID } = req.params; 
    const { title, fundingAgency, startDate, endDate, budget } = req.body;

    if (!typeID) {
      return res.status(400).json({ message: "TypeID is required" });
    }

    const existing = await prisma.researchProjects.findUnique({
      where: { TypeID_FacultyID: { TypeID: typeID, FacultyID: facultyId } }
    });
    
    if (!existing) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updated = await prisma.researchProjects.update({
      where: { TypeID_FacultyID: { TypeID: typeID, FacultyID: facultyId } },
      data: {
        Title: title,
        FundingAgency: fundingAgency,
        StartDate: startDate ? new Date(startDate) : existing.StartDate,
        EndDate: endDate ? new Date(endDate) : existing.EndDate,
        Budget: budget !== undefined ? Number(budget) : existing.Budget,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteResearchProject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { typeID } = req.params; 
    
    if (!typeID) {
      return res.status(400).json({ message: "TypeID is required" });
    }

    const deleted = await prisma.researchProjects.deleteMany({
      where: { FacultyID: facultyId, TypeID: typeID }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Project not found or not yours" });
    }

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
