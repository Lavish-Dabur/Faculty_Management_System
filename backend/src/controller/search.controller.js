import prisma from "../utils/db.js";

export const searchFaculty = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const faculty = await prisma.faculty.findMany({
      where: {
        OR: [
          {
            Name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            Department: {
              Name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            ResearchProjects: {
              some: {
                ResearchProject: {
                  Title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            Publications: {
              some: {
                Publication: {
                  Title: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        Department: true,
        ResearchProjects: { include: { ResearchProject: true } },
        Publications: { include: { Publication: true } },
      },
    });

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error searching faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};