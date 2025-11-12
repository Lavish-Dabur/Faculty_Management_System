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

    if (!existing) {
      return res.status(404).json({ message: "Award not found" });
    }

    if (existing.FacultyID !== facultyId) {
      return res.status(403).json({ message: "Not authorized to update this award" });
    }

    const data = {};
    if (awardName !== undefined) data.AwardName = awardName;
    if (awardingBody !== undefined) data.AwardingBody = awardingBody;
    if (location !== undefined) data.Location = location;
    if (yearAwarded !== undefined) data.YearAwarded = parseInt(yearAwarded);

    const updatedAward = await prisma.awards.update({
      where: { AwardID: parseInt(awardId) },
      data
    });

    res.status(200).json(updatedAward);
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

    if (!existing) {
      return res.status(404).json({ message: "Award not found" });
    }

    if (existing.FacultyID !== facultyId) {
      return res.status(403).json({ message: "Not authorized to delete this award" });
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
