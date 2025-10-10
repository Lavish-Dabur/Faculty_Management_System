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
    console.log('req.user:', req.user); // Debugging
    if (!req.user || !req.user.FacultyID) {
      return res.status(401).json({ message: "Unauthorized: Invalid faculty ID" });
    }
    const facultyId = req.user.FacultyID;
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
    const { projectId } = req.params;
    const { title, fundingAgency, startDate, endDate, budget, typeID } = req.body;

    const existing = await prisma.researchProjects.findUnique({
      where: { ProjectID: parseInt(projectId) },
    });
    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updated = await prisma.researchProjects.update({
      where: { ProjectID: parseInt(projectId) },
      data: {
        Title: title ?? existing.Title,
        FundingAgency: fundingAgency ?? existing.FundingAgency,
        StartDate: startDate ? new Date(startDate) : existing.StartDate,
        EndDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.EndDate,
        Budget: budget !== undefined ? Number(budget) : existing.Budget,
        TypeID: typeID ?? existing.TypeID,
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
    const { projectId } = req.params;

    const existing = await prisma.researchProjects.findUnique({
      where: { ProjectID: parseInt(projectId) },
    });
    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.researchProjects.delete({
      where: { ProjectID: parseInt(projectId) },
    });

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
