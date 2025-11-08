import prisma from '../utils/db.js';

// Get all awards for a faculty member
export const getFacultyAwards = async (req, res) => {
    try {
        const facultyId = parseInt(req.params.facultyId);
        const awards = await prisma.awards.findMany({
            where: {
                FacultyID: facultyId
            }
        });
        res.json(awards);
    } catch (error) {
        res.status(500).json({ message: "Error fetching awards", error: error.message });
    }
};

// Add a new award
export const addAward = async (req, res) => {
    try {
        const { facultyId, awardName, awardingBody, location, yearAwarded } = req.body;
        
        const award = await prisma.awards.create({
            data: {
                FacultyID: parseInt(facultyId),
                AwardName: awardName,
                AwardingBody: awardingBody,
                Location: location,
                YearAwarded: parseInt(yearAwarded)
            }
        });
        
        res.status(201).json(award);
    } catch (error) {
        res.status(500).json({ message: "Error adding award", error: error.message });
    }
};

// Update an award
export const updateAward = async (req, res) => {
    try {
        const awardId = parseInt(req.params.awardId);
        const { awardName, awardingBody, location, yearAwarded } = req.body;
        
        const award = await prisma.awards.update({
            where: {
                AwardID: awardId
            },
            data: {
                AwardName: awardName,
                AwardingBody: awardingBody,
                Location: location,
                YearAwarded: parseInt(yearAwarded)
            }
        });
        
        res.json(award);
    } catch (error) {
        res.status(500).json({ message: "Error updating award", error: error.message });
    }
};

// Delete an award
export const deleteAward = async (req, res) => {
    try {
        const awardId = parseInt(req.params.awardId);
        
        await prisma.awards.delete({
            where: {
                AwardID: awardId
            }
        });
        
        res.json({ message: "Award deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting award", error: error.message });
    }
};