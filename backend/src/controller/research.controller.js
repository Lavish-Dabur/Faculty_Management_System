import prisma from "../utils/db.js";

export const addResearchProject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const {
      Title,
      FundingAgency,
      StartDate,
      EndDate,
      Budget,
      TypeID
    } = req.body;

    if (!Title || !StartDate || !TypeID) {
      return res.status(400).json({ 
        message: "Title, start date, and type are required" 
      });
    }

    const project = await prisma.researchProjects.create({
      data: {
        Title,
        FundingAgency,
        StartDate: new Date(StartDate),
        EndDate: EndDate ? new Date(EndDate) : null,
        Budget: Budget ? parseFloat(Budget) : null,
        FacultyID: facultyId,
        TypeID
      }
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
    
    const projects = await prisma.researchProjects.findMany({
      where: { FacultyID: facultyId },
      orderBy: { StartDate: "desc" },
      include: {
        Type: true
      }
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error listing research projects:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateResearchProject = async (req, res) => {
  try {
    const { projectID } = req.params;
    const {
      Title,
      FundingAgency,
      StartDate,
      EndDate,
      Budget,
      TypeID
    } = req.body;
    
    const id = parseInt(projectID);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid project id' });

    const existing = await prisma.researchProjects.findUnique({ where: { ProjectID: id } });
    if (!existing) return res.status(404).json({ message: 'Research project not found' });
    if (existing.FacultyID !== req.user.FacultyID) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const data = {};
    if (Title !== undefined) data.Title = Title;
    if (FundingAgency !== undefined) data.FundingAgency = FundingAgency;
    if (StartDate !== undefined && StartDate !== null) data.StartDate = new Date(StartDate);
    if (EndDate !== undefined) data.EndDate = EndDate ? new Date(EndDate) : null;
    if (Budget !== undefined) data.Budget = Budget ? parseFloat(Budget) : null;
    if (TypeID !== undefined) data.TypeID = TypeID;

    const updatedProject = await prisma.researchProjects.update({
      where: { ProjectID: id },
      data
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteResearchProject = async (req, res) => {
  try {
    const { projectID } = req.params;
    
    const id = parseInt(projectID);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid project id' });

    const existing = await prisma.researchProjects.findUnique({ where: { ProjectID: id } });
    if (!existing) return res.status(404).json({ message: 'Research project not found' });
    if (existing.FacultyID !== req.user.FacultyID) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await prisma.researchProjects.delete({ where: { ProjectID: id } });

    res.status(200).json({ message: "Research project deleted successfully" });
  } catch (error) {
    console.error("Error deleting research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
