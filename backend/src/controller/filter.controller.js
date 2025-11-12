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
    const { department, name, publicationType, researchInterests, format, facultyId } = req.query;

    console.log('Filter Faculty - Query params:', { department, name, publicationType, researchInterests, format, facultyId });

    const where = { isApproved: true }; // Only show approved faculty

    // Handle single faculty export by ID
    if (facultyId) {
      where.FacultyID = parseInt(facultyId);
      console.log('Filtering by facultyId:', facultyId);
    }

    // Handle name search
    if (name) {
      where.OR = [
        {
          FirstName: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          LastName: {
            contains: name,
            mode: "insensitive",
          },
        },
        {
          Email: {
            contains: name,
            mode: "insensitive",
          },
        },
      ];
    }

    // Handle department filter
    if (department && department !== 'all') {
      where.Department = {
        DepartmentName: {
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
              PublicationType: {
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
          Title: {
            contains: researchInterests,
            mode: "insensitive",
          },
        },
      };
    }

    const faculty = await prisma.faculty.findMany({
      where,
      include: {
        Department: {
          select: {
            DepartmentName: true
          }
        }
      },
      orderBy: {
        FirstName: 'asc'
      }
    });

    console.log(`Found ${faculty.length} faculty members`);

    if (format) {
      console.log('Export requested with format:', format);
      
      // If exporting single faculty profile, include more comprehensive data
      if (facultyId && faculty.length === 1) {
        const facultyData = await prisma.faculty.findUnique({
          where: { FacultyID: parseInt(facultyId) },
          include: {
            Department: true,
            ResearchProjects: true,
            FacultyPublicationLink: {
              include: {
                Publication: true
              }
            },
            Awards: true,
            SubjectTaught: true,
            Qualification: true,
            Events: true,
            Outreach: true,
            Patent: true,
            CitationMetrics: true
          }
        });

        const profileData = [{
          'Profile Information': '',
          'First Name': facultyData.FirstName,
          'Last Name': facultyData.LastName,
          'Email': facultyData.Email,
          'Phone': facultyData.Phone || 'N/A',
          'Role': facultyData.Role || 'Faculty',
          'Department': facultyData.Department?.DepartmentName || 'Not assigned',
          'Research Projects': facultyData.ResearchProjects?.length || 0,
          'Publications': facultyData.FacultyPublicationLink?.length || 0,
          'Awards': facultyData.Awards?.length || 0,
          'Qualifications': facultyData.Qualification?.length || 0,
          'Teaching Experience': facultyData.SubjectTaught?.length || 0,
          'Events': facultyData.Events?.length || 0,
          'Outreach': facultyData.Outreach?.length || 0,
          'Patents': facultyData.Patent?.length || 0,
        }];

        return exportFilteredData(res, profileData, format, `${facultyData.FirstName}_${facultyData.LastName}_Profile`);
      }
      
      // Regular faculty list export
      const dataToExport = faculty.map(f => ({
        'First Name': f.FirstName,
        'Last Name': f.LastName,
        'Email': f.Email,
        'Phone': f.Phone || 'N/A',
        'Role': f.Role || 'Faculty',
        'Department': f.Department?.DepartmentName || 'Not assigned',
      }));

      console.log(`Exporting ${dataToExport.length} records`);

      if (dataToExport.length === 0) {
        return res.status(404).json({ message: "No faculty found for the given filters" });
      }

      return exportFilteredData(res, dataToExport, format, 'faculty_export');
    }

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error filtering faculty:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
