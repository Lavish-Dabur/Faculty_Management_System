import prisma from '../utils/db.js';

// Get all events for a faculty member
export const getFacultyEvents = async (req, res) => {
    try {
        const facultyId = parseInt(req.params.FacultyID);
        const events = await prisma.eventsOrganised.findMany({
            where: {
                FacultyID: facultyId
            },
            include: {
                Event: true // Include the EventType details
            },
            orderBy: {
                StartDate: 'desc'
            }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};

// Get all event types
export const getEventTypes = async (req, res) => {
    try {
        const eventTypes = await prisma.eventType.findMany();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event types", error: error.message });
    }
};

// Add a new event
export const addEvent = async (req, res) => {
    try {
        const { 
            facultyId,
            eventTypeId,
            title,
            organizer,
            location,
            startDate,
            endDate,
            description,
            role,
            fundingAgency
        } = req.body;
        
        const event = await prisma.eventsOrganised.create({
            data: {
                FacultyID: parseInt(facultyId),
                Event_id: parseInt(eventTypeId),
                Title: title,
                Organizer: organizer,
                Location: location,
                StartDate: startDate ? new Date(startDate) : null,
                EndDate: endDate ? new Date(endDate) : null,
                Description: description,
                Role: role,
                FundingAgency: fundingAgency
            },
            include: {
                Event: true
            }
        });
        
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error adding event", error: error.message });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const { 
            eventTypeId,
            title,
            organizer,
            location,
            startDate,
            endDate,
            description,
            role,
            fundingAgency
        } = req.body;
        
        const event = await prisma.eventsOrganised.update({
            where: {
                EventOrganisedID: eventId
            },
            data: {
                Event_id: parseInt(eventTypeId),
                Title: title,
                Organizer: organizer,
                Location: location,
                StartDate: startDate ? new Date(startDate) : null,
                EndDate: endDate ? new Date(endDate) : null,
                Description: description,
                Role: role,
                FundingAgency: fundingAgency
            },
            include: {
                Event: true
            }
        });
        
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        
        await prisma.eventsOrganised.delete({
            where: {
                EventOrganisedID: eventId
            }
        });
        
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};