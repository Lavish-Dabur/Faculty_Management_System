import prisma from '../utils/db.js';

// Get all outreach activities for a faculty member
export const getFacultyOutreachActivities = async (req, res) => {
    try {
        const facultyId = parseInt(req.params.facultyId);
        const activities = await prisma.outReachActivities.findMany({
            where: {
                FacultyID: facultyId
            },
            orderBy: {
                ActivityDate: 'desc'
            }
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching outreach activities", error: error.message });
    }
};

// Add a new outreach activity
export const addOutreachActivity = async (req, res) => {
    try {
        const { 
            facultyId, 
            activityType, 
            activityTitle, 
            institutionName, 
            activityDate, 
            description 
        } = req.body;
        
        const activity = await prisma.outReachActivities.create({
            data: {
                FacultyID: parseInt(facultyId),
                ActivityType: activityType,
                ActivityTitle: activityTitle,
                InstitutionName: institutionName,
                ActivityDate: new Date(activityDate),
                Description: description
            }
        });
        
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: "Error adding outreach activity", error: error.message });
    }
};

// Update an outreach activity
export const updateOutreachActivity = async (req, res) => {
    try {
        const activityId = parseInt(req.params.activityId);
        const { 
            activityType, 
            activityTitle, 
            institutionName, 
            activityDate, 
            description 
        } = req.body;
        
        const activity = await prisma.outReachActivities.update({
            where: {
                ActivityID: activityId
            },
            data: {
                ActivityType: activityType,
                ActivityTitle: activityTitle,
                InstitutionName: institutionName,
                ActivityDate: new Date(activityDate),
                Description: description
            }
        });
        
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: "Error updating outreach activity", error: error.message });
    }
};

// Delete an outreach activity
export const deleteOutreachActivity = async (req, res) => {
    try {
        const activityId = parseInt(req.params.activityId);
        
        await prisma.outReachActivities.delete({
            where: {
                ActivityID: activityId
            }
        });
        
        res.json({ message: "Outreach activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting outreach activity", error: error.message });
    }
};