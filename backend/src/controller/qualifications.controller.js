import prisma from "../utils/db.js";

export const addQualification = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { degree, institution, yearOfCompletion } = req.body;

    if (!degree || !institution || !yearOfCompletion) {
      return res.status(400).json({ message: "Degree, institution, and completion year are required" });
    }

    const qualification = await prisma.facultyQualification.create({
      data: {
        FacultyID: facultyId,
        Degree: degree,
        Institution: institution,
        YearOfCompletion: new Date(yearOfCompletion)
      }
    });

    res.status(201).json(qualification);
  } catch (error) {
    console.error("Error adding qualification:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listQualifications = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const qualifications = await prisma.facultyQualification.findMany({
      where: { FacultyID: facultyId },
      orderBy: { YearOfCompletion: "desc" }
    });

    res.status(200).json(qualifications);
  } catch (error) {
    console.error("Error listing qualifications:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateQualification = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { qualificationId } = req.params;
    const { degree, institution, yearOfCompletion } = req.body;

    const existing = await prisma.facultyQualification.findUnique({
      where: { QualificationID: parseInt(qualificationId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Qualification not found" });
    }

    const updated = await prisma.facultyQualification.update({
      where: { QualificationID: parseInt(qualificationId) },
      data: {
        Degree: degree || existing.Degree,
        Institution: institution || existing.Institution,
        YearOfCompletion: yearOfCompletion ? new Date(yearOfCompletion) : existing.YearOfCompletion
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating qualification:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteQualification = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { qualificationId } = req.params;

    const existing = await prisma.facultyQualification.findUnique({
      where: { QualificationID: parseInt(qualificationId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Qualification not found" });
    }

    await prisma.facultyQualification.delete({
      where: { QualificationID: parseInt(qualificationId) }
    });

    res.status(200).json({ message: "Qualification deleted successfully" });
  } catch (error) {
    console.error("Error deleting qualification:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};