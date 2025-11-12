import prisma from "../utils/db.js";

export const addTeachingExperience = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const {
      OrganizationName,
      organizationName,
      Designation,
      designation,
      StartDate,
      startDate,
      EndDate,
      endDate,
      NatureOfWork,
      natureOfWork
    } = req.body;

    // Support both naming conventions
    const orgName = OrganizationName || organizationName;
    const desig = Designation || designation;
    const start = StartDate || startDate;
    const end = EndDate || endDate;
    const nature = NatureOfWork || natureOfWork;

    if (!orgName || !desig || !start) {
      return res.status(400).json({ 
        message: "Organization name, designation, and start date are required" 
      });
    }

    const experience = await prisma.teachingExperience.create({
      data: {
        FacultyID: facultyId,
        OrganizationName: orgName,
        Designation: desig,
        StartDate: new Date(start),
        EndDate: end ? new Date(end) : null,
        NatureOfWork: nature || null
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
    const {
      OrganizationName,
      Designation,
      StartDate,
      EndDate,
      NatureOfWork,
      organizationName,
      designation,
      startDate,
      endDate,
      natureOfWork
    } = req.body;

    const existing = await prisma.teachingExperience.findUnique({
      where: { ExperienceID: parseInt(experienceId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Teaching experience not found" });
    }

    // Support both naming conventions
    const orgName = OrganizationName || organizationName;
    const desig = Designation || designation;
    const sDate = StartDate || startDate;
    const eDate = EndDate !== undefined ? EndDate : endDate;
    const nature = NatureOfWork !== undefined ? NatureOfWork : natureOfWork;

    const updatedExperience = await prisma.teachingExperience.update({
      where: { ExperienceID: parseInt(experienceId) },
      data: {
        OrganizationName: orgName || existing.OrganizationName,
        Designation: desig || existing.Designation,
        StartDate: sDate ? new Date(sDate) : existing.StartDate,
        EndDate: eDate !== undefined ? (eDate ? new Date(eDate) : null) : existing.EndDate,
        NatureOfWork: nature !== undefined ? nature : existing.NatureOfWork
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

// ============ SUBJECTS TAUGHT CONTROLLERS ============

export const addSubject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { SubjectName, SubjectCode, Credits } = req.body;

    if (!SubjectName || !SubjectCode) {
      return res.status(400).json({ 
        message: "Subject name and code are required" 
      });
    }

    const subject = await prisma.subjectsTaught.create({
      data: {
        FacultyID: facultyId,
        SubjectName,
        SubjectCode,
        Credits: Credits ? parseInt(Credits) : null
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
    const subjects = await prisma.subjectsTaught.findMany({
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
    const facultyId = req.user.FacultyID;
    const { subjectId } = req.params;
    const { SubjectName, SubjectCode, Credits } = req.body;

    const existing = await prisma.subjectsTaught.findUnique({
      where: { SubjectID: parseInt(subjectId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const subject = await prisma.subjectsTaught.update({
      where: { SubjectID: parseInt(subjectId) },
      data: {
        SubjectName: SubjectName || existing.SubjectName,
        SubjectCode: SubjectCode || existing.SubjectCode,
        Credits: Credits !== undefined ? parseInt(Credits) : existing.Credits
      }
    });

    res.status(200).json(subject);
  } catch (error) {
    console.error("Error updating subject:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { subjectId } = req.params;

    const existing = await prisma.subjectsTaught.findUnique({
      where: { SubjectID: parseInt(subjectId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await prisma.subjectsTaught.delete({
      where: { SubjectID: parseInt(subjectId) }
    });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
