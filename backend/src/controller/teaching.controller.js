import prisma from "../utils/db.js";

// ============ TEACHING EXPERIENCE CONTROLLERS (Work History) ============

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

    const experience = await prisma.subjectTaught.create({
      data: {
        FacultyID: facultyId,
        Level: Designation, // Using Designation as Level
        SubjectName: `${OrganizationName} - ${NatureOfWork || 'Teaching'}`
      }
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error("Error adding teaching experience:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const listTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const experiences = await prisma.subjectTaught.findMany({
      where: { FacultyID: facultyId },
      orderBy: { SubjectTaughtID: "desc" }
    });

    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error listing teaching experience:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { experienceId } = req.params;
    const {
      OrganizationName,
      Designation,
      NatureOfWork
    } = req.body;

    const existing = await prisma.subjectTaught.findUnique({
      where: { SubjectTaughtID: parseInt(experienceId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Teaching experience not found" });
    }

    const updated = await prisma.subjectTaught.update({
      where: { SubjectTaughtID: parseInt(experienceId) },
      data: {
        Level: Designation || existing.Level,
        SubjectName: OrganizationName ? `${OrganizationName} - ${NatureOfWork || 'Teaching'}` : existing.SubjectName
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating teaching experience:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { experienceId } = req.params;

    const existing = await prisma.subjectTaught.findUnique({
      where: { SubjectTaughtID: parseInt(experienceId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Teaching experience not found" });
    }

    await prisma.subjectTaught.delete({
      where: { SubjectTaughtID: parseInt(experienceId) }
    });

    res.status(200).json({ message: "Teaching experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting teaching experience:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ============ SUBJECTS TAUGHT CONTROLLERS ============

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
        FacultyID: facultyId,
        SubjectName,
        Level
      }
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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
    console.error("Error listing subjects:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { subjectId } = req.params;
    const { SubjectName, Level } = req.body;

    const existing = await prisma.subjectTaught.findUnique({
      where: { SubjectTaughtID: parseInt(subjectId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const subject = await prisma.subjectTaught.update({
      where: { SubjectTaughtID: parseInt(subjectId) },
      data: {
        SubjectName: SubjectName || existing.SubjectName,
        Level: Level || existing.Level
      }
    });

    res.status(200).json(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { subjectId } = req.params;

    const existing = await prisma.subjectTaught.findUnique({
      where: { SubjectTaughtID: parseInt(subjectId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await prisma.subjectTaught.delete({
      where: { SubjectTaughtID: parseInt(subjectId) }
    });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
