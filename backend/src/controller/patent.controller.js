import prisma from "../utils/db.js";

export const addPatent = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const {
      Title,
      PatentNumber,
      FilingDate,
      PublicationDate,
      Authority,
      CollaborationInstitute,
      TypeID
    } = req.body;

    if (!Title || !PatentNumber || !FilingDate || !TypeID) {
      return res.status(400).json({ 
        message: "Title, patent number, filing date, and type are required" 
      });
    }

    const patent = await prisma.patents.create({
      data: {
        Title,
        PatentNumber,
        FilingDate: new Date(FilingDate),
        PublicationDate: PublicationDate ? new Date(PublicationDate) : null,
        Authority,
        CollaborationInstitute,
        FacultyID: facultyId,
        TypeID
      }
    });

    res.status(201).json(patent);
  } catch (error) {
    console.error("Error adding patent:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listPatents = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    
    const patents = await prisma.patents.findMany({
      where: { FacultyID: facultyId },
      orderBy: { FilingDate: "desc" },
      include: {
        Type: true
      }
    });

    res.status(200).json(patents);
  } catch (error) {
    console.error("Error listing patents:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePatent = async (req, res) => {
  try {
    const { patentId } = req.params;
    const {
      Title,
      PatentNumber,
      FilingDate,
      PublicationDate,
      Authority,
      CollaborationInstitute,
      TypeID
    } = req.body;
    const id = parseInt(patentId);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid patent id' });

    // Ensure patent exists and belongs to requesting faculty
    const existing = await prisma.patents.findUnique({ where: { PatentID: id } });
    if (!existing) return res.status(404).json({ message: 'Patent not found' });
    if (existing.FacultyID !== req.user.FacultyID) {
      return res.status(403).json({ message: 'Not authorized to update this patent' });
    }

    // Build update payload with only provided fields
    const data = {};
    if (Title !== undefined) data.Title = Title;
    if (PatentNumber !== undefined) data.PatentNumber = PatentNumber;
    if (FilingDate !== undefined && FilingDate !== null) data.FilingDate = new Date(FilingDate);
    if (PublicationDate !== undefined) data.PublicationDate = PublicationDate ? new Date(PublicationDate) : null;
    if (Authority !== undefined) data.Authority = Authority;
    if (CollaborationInstitute !== undefined) data.CollaborationInstitute = CollaborationInstitute;
    if (TypeID !== undefined) data.TypeID = TypeID;

    const updatedPatent = await prisma.patents.update({
      where: { PatentID: id },
      data
    });

    res.status(200).json(updatedPatent);
  } catch (error) {
    console.error("Error updating patent:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePatent = async (req, res) => {
  try {
    const { patentId } = req.params;

    const id = parseInt(patentId);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid patent id' });

    // Ensure patent exists and belongs to requesting faculty
    const existing = await prisma.patents.findUnique({ where: { PatentID: id } });
    if (!existing) return res.status(404).json({ message: 'Patent not found' });
    if (existing.FacultyID !== req.user.FacultyID) {
      return res.status(403).json({ message: 'Not authorized to delete this patent' });
    }

    await prisma.patents.delete({ where: { PatentID: id } });

    res.status(200).json({ message: "Patent deleted successfully" });
  } catch (error) {
    console.error("Error deleting patent:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};