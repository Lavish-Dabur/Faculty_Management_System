import prisma from "../utils/db.js";

export const addTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { organizationName, designation, startDate, endDate, natureOfWork } = req.body;

    if (!organizationName || !designation || !startDate) {
      return res.status(400).json({ message: "Organization, designation, and start date are required" });
    }

    const experience = await prisma.teachingExperience.create({
      data: {
        FacultyID: facultyId,
        OrganizationName: organizationName,
        Designation: designation,
        StartDate: new Date(startDate),
        EndDate: endDate ? new Date(endDate) : null,
        NatureOfWork: natureOfWork || null
      }
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error("Error adding teaching experience:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const experiences = await prisma.teachingExperience.findMany({
      where: { FacultyID: facultyId },
      orderBy: { StartDate: "desc" }
    });

    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error listing teaching experience:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { experienceId } = req.params;
    const { organizationName, designation, startDate, endDate, natureOfWork } = req.body;

    const existing = await prisma.teachingExperience.findUnique({
      where: { ExperienceID: parseInt(experienceId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Teaching experience not found" });
    }

    const updated = await prisma.teachingExperience.update({
      where: { ExperienceID: parseInt(experienceId) },
      data: {
        OrganizationName: organizationName || existing.OrganizationName,
        Designation: designation || existing.Designation,
        StartDate: startDate ? new Date(startDate) : existing.StartDate,
        EndDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.EndDate,
        NatureOfWork: natureOfWork !== undefined ? natureOfWork : existing.NatureOfWork
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating teaching experience:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { experienceId } = req.params;

    const existing = await prisma.teachingExperience.findUnique({
      where: { ExperienceID: parseInt(experienceId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Teaching experience not found" });
    }

    await prisma.teachingExperience.delete({
      where: { ExperienceID: parseInt(experienceId) }
    });

    res.status(200).json({ message: "Teaching experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting teaching experience:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};