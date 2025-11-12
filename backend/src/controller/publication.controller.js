import prisma from "../utils/db.js";

export const addPublication = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    const {
      title,
      typeID,
      publicationYear,
      fundingAgency,
      typeOfIndexing,
      // Journal specific
      journalName,
      volumeNumber,
      issueNumber,
      issnNumber,
      // Book specific
      publisher,
      edition,
      volume,
      isbnNumber,
      // Conference specific
      conferenceLocation,
      pageNumbers
    } = req.body;

    if (!title || !typeID || !publicationYear) {
      return res.status(400).json({ 
        message: "Title, type, and publication year are required" 
      });
    }

    // Create the publication
    const publication = await prisma.publications.create({
      data: {
        Title: title,
        TypeID: typeID,
        PublicationYear: new Date(publicationYear),
        FundingAgency: fundingAgency || null
      }
    });

    // Link to faculty
    await prisma.facultyPublicationLink.create({
      data: {
        PublicationID: publication.PublicationID,
        FacultyID: facultyId,
        TypeOfIndexing: typeOfIndexing || null
      }
    });

    // Add type-specific details based on typeID
    if (typeID.includes('journal')) {
      await prisma.journalPublicationDetails.create({
        data: {
          PublicationID: publication.PublicationID,
          Name: journalName || null,
          VolumeNumber: volumeNumber || null,
          IssueNumber: issueNumber || null,
          ISSN_Number: issnNumber ? parseInt(issnNumber) : null
        }
      });
    } else if (typeID.includes('book')) {
      await prisma.bookPublicationDetails.create({
        data: {
          PublicationID: publication.PublicationID,
          Publisher: publisher || null,
          Edition: edition || null,
          VolumeNumber: volume || null,
          ISBN_Number: isbnNumber || null
        }
      });
    } else if (typeID.includes('conference')) {
      await prisma.conferencePaperDetails.create({
        data: {
          PublicationID: publication.PublicationID,
          Publisher: publisher || null,
          Location: conferenceLocation || null,
          PageNumbers: pageNumbers || null
        }
      });
    }

    res.status(201).json(publication);
  } catch (error) {
    console.error("Error adding publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const listPublications = async (req, res) => {
  try {
    const facultyId = req.user.FacultyID;
    
    const links = await prisma.facultyPublicationLink.findMany({
      where: { FacultyID: facultyId },
      include: {
        Publication: {
          include: {
            Type: true,
            JournalPublicationDetails: true,
            BookPublicationDetails: true,
            ConferencePaperDetails: true
          }
        }
      }
    });

    const publications = links.map(link => ({
      ...link.Publication,
      TypeOfIndexing: link.TypeOfIndexing
    }));

    res.status(200).json(publications);
  } catch (error) {
    console.error("Error listing publications:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updatePublication = async (req, res) => {
  try {
    const { publicationId } = req.params;
    const {
      title,
      typeID,
      publicationYear,
      fundingAgency,
      typeOfIndexing,
      // Journal specific
      journalName,
      volumeNumber,
      issueNumber,
      issnNumber,
      // Book specific
      publisher,
      edition,
      volume,
      isbnNumber,
      // Conference specific
      conferenceLocation,
      pageNumbers
    } = req.body;
    
    const id = parseInt(publicationId);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid publication id' });

    // Verify ownership through junction table
    const link = await prisma.facultyPublicationLink.findFirst({
      where: {
        PublicationID: id,
        FacultyID: req.user.FacultyID
      }
    });

    if (!link) {
      return res.status(404).json({ message: 'Publication not found or not authorized' });
    }

    // Update main publication
    const data = {};
    if (title !== undefined) data.Title = title;
    if (typeID !== undefined) data.TypeID = typeID;
    if (publicationYear !== undefined) data.PublicationYear = new Date(publicationYear);
    if (fundingAgency !== undefined) data.FundingAgency = fundingAgency;

    const updatedPublication = await prisma.publications.update({
      where: { PublicationID: id },
      data
    });

    // Update type of indexing in link table
    if (typeOfIndexing !== undefined) {
      await prisma.facultyPublicationLink.update({
        where: { LinkID: link.LinkID },
        data: { TypeOfIndexing: typeOfIndexing }
      });
    }

    res.status(200).json(updatedPublication);
  } catch (error) {
    console.error("Error updating publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const { publicationId } = req.params;
    
    const id = parseInt(publicationId);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid publication id' });

    // Verify ownership
    const link = await prisma.facultyPublicationLink.findFirst({
      where: {
        PublicationID: id,
        FacultyID: req.user.FacultyID
      }
    });

    if (!link) {
      return res.status(404).json({ message: 'Publication not found or not authorized' });
    }

    // Delete the link (this removes the publication from this faculty's list)
    await prisma.facultyPublicationLink.delete({
      where: { LinkID: link.LinkID }
    });

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Error deleting publication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
