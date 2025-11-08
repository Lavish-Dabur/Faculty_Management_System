import prisma from "../utils/db.js";
import { exportFilteredData } from "../utils/export.js"; 

export const ExportByName = async (req, res) => {
  try {
    const { name, format = "csv" } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Query parameter `name` is required" });
    }

    const faculty = await prisma.faculty.findFirst({
      where: {
        OR: [
          { FirstName: { contains: name, mode: "insensitive" } },
          { LastName:  { contains: name, mode: "insensitive" } }
        ]
      },
      select: { FacultyID: true, FirstName: true, LastName: true }
    });
    if (!faculty) {
      return res.status(404).json({ message: `No faculty found matching "${name}"` });
    }

    const research = await prisma.researchProjects.findMany({
      where: { FacultyID: faculty.FacultyID },
      select: {
        Title: true,
        StartDate: true,
        EndDate: true,
        Budget: true,
        TypeID: true
      }
    });

    const pubs = await prisma.facultyPublicationLink.findMany({
      where: { FacultyID: faculty.FacultyID },
      select: {
        Publication: {
          select: {
            Title: true,
            PublicationYear: true,
            FundingAgency: true,
            TypeID: true
          }
        }
      }
    });

    const data = [
      ...research.map(r => ({
        Category: "Research Project",
        Title: r.Title,
        Year: r.StartDate.getFullYear(),
        FundingAgency: r.FundingAgency || "",
        Budget: r.Budget != null ? r.Budget.toString() : "",
        TypeID: r.TypeID
      })),
      ...pubs.map(p => ({
        Category: "Publication",
        Title: p.Publication.Title,
        Year: p.Publication.PublicationYear.getFullYear(),
        FundingAgency: p.Publication.FundingAgency || "",
        Budget: "",
        TypeID: p.Publication.TypeID
      }))
    ];

    const fileBaseName = `${faculty.FirstName}_${faculty.LastName}_export`;
    return exportFilteredData(res, data, format, fileBaseName);

  } catch (error) {
    console.error("Error in filterAndExportByName:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const filterFaculty = async (req, res) => {
  try {
    const { department, publicationType, researchInterests, format } = req.query;

    const where = {};

    if (department) {
      where.Department = {
        Name: {
          contains: department,
          mode: "insensitive",
        },
      };
    }

    if (publicationType) {
      where.Publications = {
        some: {
          Publication: {
            Type: {
              Name: {
                contains: publicationType,
                mode: "insensitive",
              },
            },
          },
        },
      };
    }

    if (researchInterests) {
      where.ResearchProjects = {
        some: {
          ResearchProject: {
            Title: {
              contains: researchInterests,
              mode: "insensitive",
            },
          },
        },
      };
    }

    const faculty = await prisma.faculty.findMany({
      where,
      include: {
        Department: true,
        ResearchProjects: { include: { ResearchProject: true } },
        Publications: { include: { Publication: { include: { Type: true } } } },
      },
    });

    if (format) {
      const dataToExport = faculty.map(f => ({
        'First Name': f.FirstName,
        'Last Name': f.LastName,
        'Department': f.Department.Name,
        'Email': f.Email,
        'Phone': f.Phone,
        'Designation': f.Designation,
      }));

      if (dataToExport.length === 0) {
        return res.status(404).json({ message: "No faculty found for the given filters" });
      }

      return exportFilteredData(res, dataToExport, format, 'faculty_export');
    }

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error filtering faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
