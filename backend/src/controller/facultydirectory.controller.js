import prisma from "../utils/db.js";

export const listFaculty = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department,
      role,
      search
    } = req.query;

    const where = {};
    if (department) {
      where.Department = { DepartmentName: department };
    }
    if (role) {
      where.Role = role;
    }
    if (search) {
      where.OR = [
        { FirstName: { contains: search, mode: "insensitive" } },
        { LastName:  { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, faculty] = await Promise.all([
      prisma.faculty.count({ where }),
      prisma.faculty.findMany({
        where,
        skip,
        take,
        orderBy: { LastName: "asc" },
        select: {
          FacultyID: true,
          FirstName: true,
          LastName: true,
          Role: true,
          Department: { select: { DepartmentName: true } },
        },
      }),
    ]);

    return res.status(200).json({
      total,
      page: Number(page),
      pageCount: Math.ceil(total / take),
      faculty,
    });
  } catch (error) {
    console.error("Error in listFaculty controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};