import prisma from '../utils/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Get counts and stats in parallel
    const [
      publicationCount,
      researchCount,
      patentCount,
      citationMetrics,
      recentPublications,
      recentResearch,
      recentPatents,
      teachingExperience,
      qualifications,
      awards,
      events,
      outreachActivities,
      subjectsTaught,
      recentAwards,
      recentEvents
    ] = await Promise.all([
      // Get publication count
      prisma.facultyPublicationLink.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get research projects count
      prisma.researchProjects.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get patents count
      prisma.patents.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get latest citation metrics
      prisma.citationMetrics.findFirst({
        where: { FacultyID: parseInt(facultyId) },
        orderBy: { YearRecorded: 'desc' }
      }),

      // Get 5 most recent publications
      prisma.facultyPublicationLink.findMany({
        where: { FacultyID: parseInt(facultyId) },
        include: {
          Publication: true
        },
        orderBy: {
          Publication: {
            PublicationYear: 'desc'
          }
        },
        take: 5
      }),

      // Get 5 most recent research projects
      prisma.researchProjects.findMany({
        where: { FacultyID: parseInt(facultyId) },
        orderBy: { StartDate: 'desc' },
        take: 5
      }),

      // Get 5 most recent patents
      prisma.patents.findMany({
        where: { FacultyID: parseInt(facultyId) },
        orderBy: { FilingDate: 'desc' },
        take: 5
      }),

      // Get teaching experience (subjects taught)
      prisma.subjectTaught.findMany({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get qualifications
      prisma.facultyQualification.findMany({
        where: { FacultyID: parseInt(facultyId) },
        orderBy: { YearOfCompletion: 'desc' }
      }),

      // Get awards count
      prisma.awards.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get events count
      prisma.eventsOrganised.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get outreach activities count
      prisma.outReachActivities.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get subjects taught count
      prisma.subjectTaught.count({
        where: { FacultyID: parseInt(facultyId) }
      }),

      // Get 5 most recent awards
      prisma.awards.findMany({
        where: { FacultyID: parseInt(facultyId) },
        orderBy: { YearAwarded: 'desc' },
        take: 5
      }),

      // Get 5 most recent events
      prisma.eventsOrganised.findMany({
        where: { FacultyID: parseInt(facultyId) },
        include: { Event: true },
        orderBy: { StartDate: 'desc' },
        take: 5
      })
    ]);

    // Calculate total teaching experience in years
    const teachingYears = teachingExperience.reduce((total, exp) => {
      const start = new Date(exp.StartDate);
      const end = exp.EndDate ? new Date(exp.EndDate) : new Date();
      const years = (end.getFullYear() - start.getFullYear()) +
                  (end.getMonth() - start.getMonth()) / 12;
      return total + years;
    }, 0);

    // Combine recent activities and sort by date
    const recentActivity = [
      ...recentPublications.map(pub => ({
        title: pub.Publication.Title,
        type: 'Publication',
        date: pub.Publication.PublicationYear,
        link: `/publications`
      })),
      ...recentResearch.map(research => ({
        title: research.Title,
        type: 'Research Project',
        date: research.StartDate,
        link: `/research`
      })),
      ...recentPatents.map(patent => ({
        title: patent.Title,
        type: 'Patent',
        date: patent.FilingDate,
        link: `/patents`
      })),
      ...recentAwards.map(award => ({
        title: award.AwardName,
        type: 'Award',
        date: new Date(award.YearAwarded, 0),
        link: `/awards`
      })),
      ...recentEvents.map(event => ({
        title: event.Title,
        type: `Event (${event.Event.EventType})`,
        date: event.StartDate,
        link: `/events`
      }))
    ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

    // Get citation trends
    const citationTrends = await prisma.citationMetrics.findMany({
      where: { FacultyID: parseInt(facultyId) },
      orderBy: { YearRecorded: 'asc' }
    });

    res.status(200).json({
      counts: {
        publications: publicationCount,
        researchProjects: researchCount,
        patents: patentCount,
        awards,
        events,
        outreachActivities,
        subjectsTaught,
        qualifications: qualifications.length
      },
      experience: {
        teachingYears: Math.round(teachingYears * 10) / 10, // Round to 1 decimal place
        qualificationsCount: qualifications.length,
        highestQualification: qualifications[0]?.Degree || 'N/A'
      },
      citations: {
        totalCitations: citationMetrics?.TotalCitations || 0,
        hIndex: citationMetrics?.HIndex || 0,
        i10Index: citationMetrics?.I10Index || 0,
        trends: citationTrends
      },
      recentActivity,
      qualifications
    });

  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};