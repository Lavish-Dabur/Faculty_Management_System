import prisma from "../utils/db.js";


export const addPublication = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const { title, publicationYear, fundingAgency, typeID, typeOfIndexing } = req.body;

    if (!title || !publicationYear || !typeID) {
      return res.status(400).json({ message: "Title, publication year, and type ID are required" });
    }

 
    const publication = await prisma.publications.create({
      data: {
        TypeID: typeID,
        Title: title,
        PublicationYear: new Date(publicationYear),
        FundingAgency: fundingAgency,
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
        Publication: {
          include: {
            Type: true,
          },
        },
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
    const facultyId = req.user.FacultyID;
    const publicationId = parseInt(req.params.id, 10);
    const { title, publicationYear, fundingAgency, typeOfIndexing } = req.body;

    if (isNaN(publicationId)) {
      return res.status(400).json({ message: "Invalid publication ID" });
    }

  
    const link = await prisma.facultyPublicationLink.findUnique({
      where: { PublicationID_FacultyID: { PublicationID: publicationId, FacultyID: facultyId } },
    });

    if (!link) {
      return res.status(404).json({ message: "Publication not found or not yours" });
    }

    const updated = await prisma.publications.update({
      where: { PublicationID: publicationId },
      data: {
        Title: title,
        PublicationYear: publicationYear ? new Date(publicationYear) : undefined,
        FundingAgency: fundingAgency,
      },
    });


    if (typeOfIndexing !== undefined) {
      await prisma.facultyPublicationLink.update({
        where: { PublicationID_FacultyID: { PublicationID: publicationId, FacultyID: facultyId } },
        data: { TypeOfIndexing: typeOfIndexing },
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deletePublication = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const publicationId = parseInt(req.params.id, 10);

    if (isNaN(publicationId)) {
      return res.status(400).json({ message: "Invalid publication ID" });
    }

    const deleted = await prisma.facultyPublicationLink.deleteMany({
      where: { PublicationID: publicationId, FacultyID: facultyId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Publication not found or not yours" });
    }

    res.status(200).json({ message: "Publication deleted" });
  } catch (error) {
    console.error("Error deleting publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
