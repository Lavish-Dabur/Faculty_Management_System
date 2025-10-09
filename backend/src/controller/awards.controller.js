import prisma from "../utils/db.js";

export const addAward = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { awardName, awardingBody, location, yearAwarded } = req.body;

    if (!awardName || !yearAwarded) {
      return res.status(400).json({ message: "Award name and year are required" });
    }

    const award = await prisma.awards.create({
      data: {
        FacultyID: facultyId,
        AwardName: awardName,
        AwardingBody: awardingBody || null,
        Location: location || null,
        YearAwarded: parseInt(yearAwarded)
      }
    });

    res.status(201).json(award);
  } catch (error) {
    console.error("Error adding award:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listAwards = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const awards = await prisma.awards.findMany({
      where: { FacultyID: facultyId },
      orderBy: { YearAwarded: "desc" }
    });

    res.status(200).json(awards);
  } catch (error) {
    console.error("Error listing awards:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAward = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { awardId } = req.params;
    const { awardName, awardingBody, location, yearAwarded } = req.body;

    const existing = await prisma.awards.findUnique({
      where: { AwardID: parseInt(awardId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Award not found" });
    }

    const updated = await prisma.awards.update({
      where: { AwardID: parseInt(awardId) },
      data: {
        AwardName: awardName || existing.AwardName,
        AwardingBody: awardingBody !== undefined ? awardingBody : existing.AwardingBody,
        Location: location !== undefined ? location : existing.Location,
        YearAwarded: yearAwarded ? parseInt(yearAwarded) : existing.YearAwarded
      }
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating award:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAward = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { awardId } = req.params;

    const existing = await prisma.awards.findUnique({
      where: { AwardID: parseInt(awardId) }
    });

    if (!existing || existing.FacultyID !== facultyId) {
      return res.status(404).json({ message: "Award not found" });
    }

    await prisma.awards.delete({
      where: { AwardID: parseInt(awardId) }
    });

    res.status(200).json({ message: "Award deleted successfully" });
  } catch (error) {
    console.error("Error deleting award:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};