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
    const { projectID } = req.params;
    const { title, fundingAgency, startDate, endDate, budget, typeID } = req.body;

    const updatedProject = await prisma.researchProjects.update({
      where: { ProjectID: parseInt(projectID) },
      data: {
        Title: title,
        FundingAgency: fundingAgency,
        StartDate: new Date(startDate),
        EndDate: endDate ? new Date(endDate) : null,
        Budget: budget ? Number(budget) : null,
        TypeID: typeID,
      },
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

    await prisma.researchProjects.delete({
      where: { ProjectID: parseInt(projectID) },
    });

    res.status(200).json({ message: "Research project deleted successfully" });
  } catch (error) {
    console.error("Error deleting research project:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
