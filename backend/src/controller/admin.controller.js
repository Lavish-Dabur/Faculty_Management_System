import prisma from "../utils/db.js";

export const getPendingRequests = async (req, res) => {
  try {
    const pending = await prisma.faculty.findMany({
      where: { isApproved: false, Role: "Faculty" },
      select: {
        FacultyID: true,
        FirstName: true,
        LastName: true,
        Email: true,
        Role: true,
        Department: { select: { DepartmentName: true } }
      }
    });

    res.status(200).json(pending);
  } catch (error) {
    console.error("Error getting pending requests:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApprovedFaculty = async (req, res) => {
  try {
    const faculty = await prisma.faculty.findMany({
      where: { isApproved: true },
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

    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error getting approved faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            Faculty: {
              where: { isApproved: true }
            }
          }
        }
      },
      orderBy: {
        DepartmentName: 'asc'
      }
    });

    // Format the response
    const formattedDepartments = departments.map(dept => ({
      DepartmentID: dept.DepartmentID,
      DepartmentName: dept.DepartmentName,
      facultyCount: dept._count.Faculty
    }));

    res.status(200).json(formattedDepartments);
  } catch (error) {
    console.error("Error getting departments:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { departmentName } = req.body;

    if (!departmentName) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const existingDepartment = await prisma.department.findUnique({
      where: { DepartmentName: departmentName }
    });

    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await prisma.department.create({
      data: { DepartmentName: departmentName }
    });

    res.status(201).json({
      message: "Department created successfully",
      department: {
        DepartmentID: department.DepartmentID,
        DepartmentName: department.DepartmentName,
        facultyCount: 0
      }
    });
  } catch (error) {
    console.error("Error adding department:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    // Check if department has faculty
    const facultyCount = await prisma.faculty.count({
      where: { DepartmentID: parseInt(departmentId) }
    });

    if (facultyCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete department with assigned faculty members" 
      });
    }

    await prisma.department.delete({
      where: { DepartmentID: parseInt(departmentId) }
    });

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const approveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await prisma.faculty.update({
      where: { FacultyID: parseInt(facultyId) },
      data: { isApproved: true },
      include: {
        Department: {
          select: {
            DepartmentName: true
          }
        }
      }
    });

    res.status(200).json({ 
      message: `${faculty.FirstName} ${faculty.LastName} approved successfully`,
      faculty: faculty
    });
  } catch (error) {
    console.error("Error approving faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rejectFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await prisma.faculty.delete({
      where: { FacultyID: parseInt(facultyId) }
    });

    res.status(200).json({ 
      message: `${faculty.FirstName} ${faculty.LastName} faculty request rejected` 
    });
  } catch (error) {
    console.error("Error rejecting faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalFaculty,
      pendingApprovals,
      totalResearch,
      totalPublications,
      totalDepartments
    ] = await Promise.all([
      prisma.faculty.count({ where: { isApproved: true } }),
      prisma.faculty.count({ where: { isApproved: false, Role: "Faculty" } }),
      prisma.researchProjects.count(),
      prisma.publications.count(),
      prisma.department.count()
    ]);

    res.status(200).json({
      totalFaculty,
      pendingApprovals,
      totalResearch,
      totalPublications,
      totalDepartments
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};