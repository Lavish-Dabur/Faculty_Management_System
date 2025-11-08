import prisma from '../utils/db.js';

// Get all citation metrics for a faculty member
export const getFacultyCitationMetrics = async (req, res) => {
    try {
        const facultyId = parseInt(req.params.facultyId);
        const metrics = await prisma.citationMetrics.findMany({
            where: {
                FacultyID: facultyId
            },
            orderBy: {
                YearRecorded: 'desc'
            }
        });
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: "Error fetching citation metrics", error: error.message });
    }
};

// Get latest citation metrics for a faculty member
export const getLatestCitationMetrics = async (req, res) => {
    try {
        const facultyId = parseInt(req.params.facultyId);
        const metrics = await prisma.citationMetrics.findFirst({
            where: {
                FacultyID: facultyId
            },
            orderBy: {
                YearRecorded: 'desc'
            }
        });
        res.json(metrics || {});
    } catch (error) {
        res.status(500).json({ message: "Error fetching latest citation metrics", error: error.message });
    }
};

// Add new citation metrics
export const addCitationMetrics = async (req, res) => {
    try {
        const { 
            facultyId,
            yearRecorded,
            source,
            hIndex,
            i10Index,
            totalCitations
        } = req.body;

        // Check if metrics already exist for this year and source
        const existingMetrics = await prisma.citationMetrics.findFirst({
            where: {
                FacultyID: parseInt(facultyId),
                YearRecorded: parseInt(yearRecorded),
                Source: source
            }
        });

        if (existingMetrics) {
            return res.status(400).json({ 
                message: `Citation metrics for ${source} already exist for year ${yearRecorded}` 
            });
        }
        
        const metrics = await prisma.citationMetrics.create({
            data: {
                FacultyID: parseInt(facultyId),
                YearRecorded: parseInt(yearRecorded),
                Source: source,
                HIndex: hIndex ? parseInt(hIndex) : null,
                I10Index: i10Index ? parseInt(i10Index) : null,
                TotalCitations: totalCitations ? parseInt(totalCitations) : null
            }
        });
        
        res.status(201).json(metrics);
    } catch (error) {
        res.status(500).json({ message: "Error adding citation metrics", error: error.message });
    }
};

// Update citation metrics
export const updateCitationMetrics = async (req, res) => {
    try {
        const metricsId = parseInt(req.params.metricsId);
        const { 
            yearRecorded,
            source,
            hIndex,
            i10Index,
            totalCitations
        } = req.body;
        
        const metrics = await prisma.citationMetrics.update({
            where: {
                MetricsID: metricsId
            },
            data: {
                YearRecorded: parseInt(yearRecorded),
                Source: source,
                HIndex: hIndex ? parseInt(hIndex) : null,
                I10Index: i10Index ? parseInt(i10Index) : null,
                TotalCitations: totalCitations ? parseInt(totalCitations) : null
            }
        });
        
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: "Error updating citation metrics", error: error.message });
    }
};

// Delete citation metrics
export const deleteCitationMetrics = async (req, res) => {
    try {
        const metricsId = parseInt(req.params.metricsId);
        
        await prisma.citationMetrics.delete({
            where: {
                MetricsID: metricsId
            }
        });
        
        res.json({ message: "Citation metrics deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting citation metrics", error: error.message });
    }
};