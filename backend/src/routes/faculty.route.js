// src/routes/faculty.route.js
import express from "express";
import prisma from "../utils/db.js";
import { getFacultyProfile, updateFacultyProfile, getFacultyById, getAllFaculty } from "../controller/faculty.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// Import controllers from other route files
import { addPublication, listPublications, updatePublication, deletePublication } from "../controller/publication.controller.js";
import { addResearchProject, deleteResearchProject, listResearchProjects, updateResearchProject } from "../controller/research.controller.js";
import { addAward, listAwards, updateAward, deleteAward } from "../controller/awards.controller.js";
import { addQualification, listQualifications, updateQualification, deleteQualification } from "../controller/qualifications.controller.js";
// Import controllers from other route files
import { addTeachingExperience, listTeachingExperience, updateTeachingExperience, deleteTeachingExperience, addSubject, listSubjects, updateSubject, deleteSubject } from "../controller/teaching.controller.js";
import { addPatent, listPatents, updatePatent, deletePatent } from "../controller/patent.controller.js";
import { getFacultyOutreachActivities, addOutreachActivity, updateOutreachActivity, deleteOutreachActivity } from "../controller/outreach.controller.js";
import { getFacultyEvents, addEvent, updateEvent, deleteEvent, getEventTypes } from "../controller/event.controller.js";
import { getFacultyCitationMetrics, addCitationMetrics, updateCitationMetrics, deleteCitationMetrics } from "../controller/citation.controller.js";

const router = express.Router();

// Basic Faculty routes
router.get("/getfaculty", protectRoute, getFacultyProfile);
router.put("/updatefaculty", protectRoute, updateFacultyProfile);
router.get("/all", getAllFaculty);

// Profile routes
router.get("/profile/:FacultyID", protectRoute, getFacultyProfile);
router.put("/profile/:FacultyID", protectRoute, updateFacultyProfile);

// Publication routes under /faculty
router.get("/publication/:FacultyID", protectRoute, listPublications);
router.post("/publication/:FacultyID", protectRoute, addPublication);
router.get("/publication/single/:publicationId", protectRoute, async (req, res) => {
  try {
    const publication = await prisma.publications.findUnique({
      where: { PublicationID: parseInt(req.params.publicationId) },
      include: {
        JournalPublicationDetails: true,
        ConferencePaperDetails: true,
        BookPublicationDetails: true
      }
    });
    if (!publication) return res.status(404).json({ message: "Publication not found" });
    res.json(publication);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/publication/:publicationId", protectRoute, updatePublication);
router.delete("/publication/:publicationId", protectRoute, deletePublication);

// Research routes under /faculty
router.get("/research/:FacultyID", protectRoute, listResearchProjects);
router.post("/research/:FacultyID", protectRoute, addResearchProject);
router.get("/research/single/:projectID", protectRoute, async (req, res) => {
  try {
    const project = await prisma.researchProjects.findUnique({
      where: { ProjectID: parseInt(req.params.projectID) }
    });
    if (!project) return res.status(404).json({ message: "Research project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/research/:projectID", protectRoute, updateResearchProject);
router.delete("/research/:projectID", protectRoute, deleteResearchProject);

// Awards routes under /faculty
router.get("/awards/:FacultyID", protectRoute, listAwards);
router.post("/awards", protectRoute, addAward);
router.get("/awards/single/:awardId", protectRoute, async (req, res) => {
  try {
    const award = await prisma.awards.findUnique({
      where: { AwardID: parseInt(req.params.awardId) }
    });
    if (!award) return res.status(404).json({ message: "Award not found" });
    res.json(award);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/awards/:awardId", protectRoute, updateAward);
router.delete("/awards/:awardId", protectRoute, deleteAward);

// Qualifications routes under /faculty
router.get("/qualifications/:FacultyID", protectRoute, listQualifications);
router.post("/qualifications", protectRoute, addQualification);
router.get("/qualifications/single/:qualificationId", protectRoute, async (req, res) => {
  try {
    const qualification = await prisma.qualifications.findUnique({
      where: { QualificationID: parseInt(req.params.qualificationId) }
    });
    if (!qualification) return res.status(404).json({ message: "Qualification not found" });
    res.json(qualification);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/qualifications/:qualificationId", protectRoute, updateQualification);
router.delete("/qualifications/:qualificationId", protectRoute, deleteQualification);

// Teaching routes under /faculty
router.get("/teaching/:FacultyID", protectRoute, listTeachingExperience);
router.post("/teaching/:FacultyID", protectRoute, addTeachingExperience);
router.get("/teaching/single/:experienceId", protectRoute, async (req, res) => {
  try {
    const experience = await prisma.teachingExperience.findUnique({
      where: { ExperienceID: parseInt(req.params.experienceId) }
    });
    if (!experience) return res.status(404).json({ message: "Teaching experience not found" });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/teaching/:experienceId", protectRoute, updateTeachingExperience);
router.delete("/teaching/:experienceId", protectRoute, deleteTeachingExperience);

// Subjects routes under /faculty
router.get("/subjects/:FacultyID", protectRoute, listSubjects);
router.post("/subjects/:FacultyID", protectRoute, addSubject);
router.get("/subjects/single/:subjectId", protectRoute, async (req, res) => {
  try {
    const subject = await prisma.subjectsTaught.findUnique({
      where: { SubjectID: parseInt(req.params.subjectId) }
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/subjects/:subjectId", protectRoute, updateSubject);
router.delete("/subjects/:subjectId", protectRoute, deleteSubject);

// Patents routes under /faculty
router.get("/patents/:FacultyID", protectRoute, listPatents);
router.post("/patents/:FacultyID", protectRoute, addPatent);
router.get("/patents/single/:patentId", protectRoute, async (req, res) => {
  try {
    const patent = await prisma.patents.findUnique({
      where: { PatentID: parseInt(req.params.patentId) }
    });
    if (!patent) return res.status(404).json({ message: "Patent not found" });
    res.json(patent);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/patents/:patentId", protectRoute, updatePatent);
router.delete("/patents/:patentId", protectRoute, deletePatent);

// Outreach routes under /faculty
router.get("/outreach/:FacultyID", protectRoute, getFacultyOutreachActivities);
router.post("/outreach", protectRoute, addOutreachActivity);
router.get("/outreach/single/:activityId", protectRoute, async (req, res) => {
  try {
    const activity = await prisma.outReachActivities.findUnique({
      where: { ActivityID: parseInt(req.params.activityId) }
    });
    if (!activity) return res.status(404).json({ message: "Outreach activity not found" });
    res.json(activity);
  } catch (error) {
    console.error('Error fetching single outreach activity:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
router.put("/outreach/:activityId", protectRoute, updateOutreachActivity);
router.delete("/outreach/:activityId", protectRoute, deleteOutreachActivity);

// Events routes under /faculty
router.get("/events/types", getEventTypes); // Must be before /:FacultyID to avoid conflict
router.get("/events/:FacultyID", protectRoute, getFacultyEvents);
router.post("/events", protectRoute, addEvent);
router.get("/events/single/:eventId", protectRoute, async (req, res) => {
  try {
    const event = await prisma.events.findUnique({
      where: { EventID: parseInt(req.params.eventId) }
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/events/:eventId", protectRoute, updateEvent);
router.delete("/events/:eventId", protectRoute, deleteEvent);

// Citations routes under /faculty
router.get("/citations/:FacultyID", protectRoute, getFacultyCitationMetrics);
router.post("/citations", protectRoute, addCitationMetrics);
router.get("/citations/single/:metricsId", protectRoute, async (req, res) => {
  try {
    const metrics = await prisma.citationMetrics.findUnique({
      where: { MetricsID: parseInt(req.params.metricsId) }
    });
    if (!metrics) return res.status(404).json({ message: "Citation metrics not found" });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/citations/:metricsId", protectRoute, updateCitationMetrics);
router.delete("/citations/:metricsId", protectRoute, deleteCitationMetrics);

// Get faculty by ID (must be LAST to avoid conflicts with named routes)
router.get("/:id", getFacultyById);

export default router;