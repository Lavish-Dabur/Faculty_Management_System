import prisma from "../utils/db.js";

export const addPublication = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { title, publicationYear, fundingAgency, typeID, typeOfIndexing } = req.body;

    if (!title || !publicationYear || !typeID) {
      return res
        .status(400)
        .json({ message: "Title, publicationYear, and typeID are required" });
    }

    const publication = await prisma.publications.create({
      data: {
        Title: title,
        PublicationYear: new Date(publicationYear),
        FundingAgency: fundingAgency,
        TypeID: typeID,
      },
    });

    const link = await prisma.facultyPublicationLink.create({
      data: {
        PublicationID: publication.PublicationID,
        FacultyID: facultyId,
        TypeOfIndexing: typeOfIndexing,
      },
    });

    res.status(201).json({ publication, link });
  } catch (error) {
    console.error("Error adding publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listPublications = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const publications = await prisma.facultyPublicationLink.findMany({
      where: { FacultyID: facultyId },
      include: {
        Publication: { include: { Type: true } },
      },
      orderBy: { Publication: { PublicationYear: "desc" } },
    });
    res.status(200).json(publications);
  } catch (error) {
    console.error("Error listing publications:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePublication = async (req, res) => {
  try {
    const { publicationId } = req.params;
    const { title, publicationYear, fundingAgency, typeID, typeOfIndexing } = req.body;

    const updatedPublication = await prisma.publications.update({
      where: { PublicationID: parseInt(publicationId) },
      data: {
        Title: title,
        PublicationYear: new Date(publicationYear),
        FundingAgency: fundingAgency,
        TypeID: typeID,
      },
    });

    const updatedLink = await prisma.facultyPublicationLink.update({
        where: { 
            FacultyID_PublicationID: {
                FacultyID: req.user.FacultyID,
                PublicationID: parseInt(publicationId)
            }
         },
        data: {
            TypeOfIndexing: typeOfIndexing
        }
    });

    res.status(200).json({ updatedPublication, updatedLink });
  } catch (error) {
    console.error("Error updating publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const { publicationId } = req.params;

    await prisma.facultyPublicationLink.delete({
        where: { 
            FacultyID_PublicationID: {
                FacultyID: req.user.FacultyID,
                PublicationID: parseInt(publicationId)
            }
         }
    });

    await prisma.publications.delete({
      where: { PublicationID: parseInt(publicationId) },
    });

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Error deleting publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
