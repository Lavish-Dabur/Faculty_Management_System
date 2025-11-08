import prisma from '../utils/db.js';

// Get all qualifications for a faculty member
export const getFacultyQualifications = async (req, res) => {
    try {
        const facultyId = parseInt(req.params.facultyId);
        const qualifications = await prisma.facultyQualification.findMany({
            where: {
                FacultyID: facultyId
            },
            orderBy: {
                YearOfCompletion: 'desc'
            }
        });
        res.json(qualifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching qualifications", error: error.message });
    }
};

// Add a new qualification
export const addQualification = async (req, res) => {
    try {
        const { 
            facultyId,
            degree,
            institution,
            yearOfCompletion
        } = req.body;
        
        const qualification = await prisma.facultyQualification.create({
            data: {
                FacultyID: parseInt(facultyId),
                Degree: degree,
                Institution: institution,
                YearOfCompletion: new Date(yearOfCompletion)
            }
        });
        
        res.status(201).json(qualification);
    } catch (error) {
        res.status(500).json({ message: "Error adding qualification", error: error.message });
    }
};

// Update a qualification
export const updateQualification = async (req, res) => {
    try {
        const qualificationId = parseInt(req.params.qualificationId);
        const { 
            degree,
            institution,
            yearOfCompletion
        } = req.body;
        
        const qualification = await prisma.facultyQualification.update({
            where: {
                QualificationID: qualificationId
            },
            data: {
                Degree: degree,
                Institution: institution,
                YearOfCompletion: new Date(yearOfCompletion)
            }
        });
        
        res.json(qualification);
    } catch (error) {
        res.status(500).json({ message: "Error updating qualification", error: error.message });
    }
};

// Delete a qualification
export const deleteQualification = async (req, res) => {
    try {
        const qualificationId = parseInt(req.params.qualificationId);
        
        await prisma.facultyQualification.delete({
            where: {
                QualificationID: qualificationId
            }
        });
        
        res.json({ message: "Qualification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting qualification", error: error.message });
    }
};