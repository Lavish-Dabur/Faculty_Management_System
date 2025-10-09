export const getPendingRequests = async (req, res) => {
  try {
    const pending = await prisma.faculty.findMany({
      where: { isApproved: false , Role: "Faculty"},
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


export const approveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await prisma.faculty.update({
      where: { FacultyID: parseInt(facultyId) },
      data: { isApproved: true }
    });

    res.status(200).json({ message: `${faculty.FirstName} ${faculty.LastName}  approved successfully` });
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

    res.status(200).json({ message: `${faculty.FirstName} ${faculty.LastName}Faculty request rejected` });
  } catch (error) {
    console.error("Error rejecting faculty:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};