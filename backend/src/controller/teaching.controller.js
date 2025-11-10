import prisma from "../utils/db.js";

export const addTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const {
      OrganizationName,
      Designation,
      StartDate,
      EndDate,
      NatureOfWork
    } = req.body;

    if (!OrganizationName || !Designation || !StartDate) {
      return res.status(400).json({ 
        message: "Organization name, designation, and start date are required" 
      });
    }

    const experience = await prisma.teachingExperience.create({
      data: {
        OrganizationName,
        Designation,
        StartDate: new Date(StartDate),
        EndDate: EndDate ? new Date(EndDate) : null,
        NatureOfWork,
        FacultyID: facultyId
      }
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error("Error adding teaching experience:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listTeachingExperiences = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    
    const experiences = await prisma.teachingExperience.findMany({
      where: { FacultyID: facultyId },
      orderBy: { StartDate: "desc" }
    });

    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error listing teaching experiences:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { experienceId } = req.params;
    const {
      OrganizationName,
      Designation,
      StartDate,
      EndDate,
      NatureOfWork
    } = req.body;

    const existing = await prisma.teachingExperience.findUnique({
      where: { ExperienceID: parseInt(experienceId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Teaching experience not found" });
    }

    const updatedExperience = await prisma.teachingExperience.update({
      where: { ExperienceID: parseInt(experienceId) },
      data: {
        OrganizationName,
        Designation,
        StartDate: new Date(StartDate),
        EndDate: EndDate ? new Date(EndDate) : null,
        NatureOfWork
      }
    });

    res.status(200).json(updatedExperience);
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

// Subject Taught Controllers
export const addSubject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { SubjectName, Level } = req.body;

    if (!SubjectName || !Level) {
      return res.status(400).json({ 
        message: "Subject name and level are required" 
      });
    }

    const subject = await prisma.subjectTaught.create({
      data: {
        SubjectName,
        Level,
        FacultyID: facultyId
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error("Error adding subject:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listSubjects = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    
    const subjects = await prisma.subjectTaught.findMany({
      where: { FacultyID: facultyId },
      orderBy: { SubjectName: "asc" }
    });

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error listing subjects:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { SubjectName, Level } = req.body;

    const updatedSubject = await prisma.subjectTaught.update({
      where: { SubjectTaughtID: parseInt(subjectId) },
      data: {
        SubjectName,
        Level
      }
    });

    res.status(200).json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    await prisma.subjectTaught.delete({
      where: { SubjectTaughtID: parseInt(subjectId) }
    });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};