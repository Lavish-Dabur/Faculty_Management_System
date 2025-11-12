import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create Types
  const types = ['publication', 'patent', 'research_project'];
  for (const t of types) {
    await prisma.TYPES.upsert({
      where: { TypeID: t },
      update: {},
      create: {
        TypeID: t,
        Type: t,
        Status: 'active',
      },
    });
  }
  console.log('✓ Types created');

  // Create Departments
  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biotechnology',
  ];
  
  const deptRecords = [];
  for (const name of departments) {
    const dept = await prisma.department.upsert({
      where: { DepartmentName: name },
      update: {},
      create: {
        DepartmentName: name,
      },
    });
    deptRecords.push(dept);
  }
  console.log('✓ Departments created');

  // Create 10 Dummy Indian Faculty Members
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const facultyData = [
    {
      FirstName: 'Rajesh',
      LastName: 'Kumar',
      Email: 'rajesh.kumar@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543210',
      Gender: 'Male',
      DOB: new Date('1985-03-15'),
      Role: 'Professor',
      DepartmentID: deptRecords[0].DepartmentID, // Computer Science
      isApproved: true
    },
    {
      FirstName: 'Priya',
      LastName: 'Sharma',
      Email: 'priya.sharma@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543211',
      Gender: 'Female',
      DOB: new Date('1988-07-22'),
      Role: 'Associate Professor',
      DepartmentID: deptRecords[1].DepartmentID, // Electrical Engineering
      isApproved: true
    },
    {
      FirstName: 'Amit',
      LastName: 'Patel',
      Email: 'amit.patel@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543212',
      Gender: 'Male',
      DOB: new Date('1990-11-08'),
      Role: 'Assistant Professor',
      DepartmentID: deptRecords[2].DepartmentID, // Mechanical Engineering
      isApproved: true
    },
    {
      FirstName: 'Sneha',
      LastName: 'Reddy',
      Email: 'sneha.reddy@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543213',
      Gender: 'Female',
      DOB: new Date('1987-05-19'),
      Role: 'Professor',
      DepartmentID: deptRecords[3].DepartmentID, // Civil Engineering
      isApproved: true
    },
    {
      FirstName: 'Vikram',
      LastName: 'Singh',
      Email: 'vikram.singh@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543214',
      Gender: 'Male',
      DOB: new Date('1983-09-30'),
      Role: 'Professor',
      DepartmentID: deptRecords[4].DepartmentID, // Mathematics
      isApproved: true
    },
    {
      FirstName: 'Anjali',
      LastName: 'Verma',
      Email: 'anjali.verma@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543215',
      Gender: 'Female',
      DOB: new Date('1992-02-14'),
      Role: 'Assistant Professor',
      DepartmentID: deptRecords[5].DepartmentID, // Physics
      isApproved: true
    },
    {
      FirstName: 'Suresh',
      LastName: 'Nair',
      Email: 'suresh.nair@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543216',
      Gender: 'Male',
      DOB: new Date('1986-12-25'),
      Role: 'Associate Professor',
      DepartmentID: deptRecords[6].DepartmentID, // Chemistry
      isApproved: true
    },
    {
      FirstName: 'Kavita',
      LastName: 'Desai',
      Email: 'kavita.desai@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543217',
      Gender: 'Female',
      DOB: new Date('1989-06-11'),
      Role: 'Associate Professor',
      DepartmentID: deptRecords[7].DepartmentID, // Biotechnology
      isApproved: true
    },
    {
      FirstName: 'Arjun',
      LastName: 'Mehta',
      Email: 'arjun.mehta@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543218',
      Gender: 'Male',
      DOB: new Date('1984-04-07'),
      Role: 'Professor',
      DepartmentID: deptRecords[0].DepartmentID, // Computer Science
      isApproved: true
    },
    {
      FirstName: 'Deepika',
      LastName: 'Iyer',
      Email: 'deepika.iyer@university.ac.in',
      Password: hashedPassword,
      Phone_no: '+91-9876543219',
      Gender: 'Female',
      DOB: new Date('1991-08-16'),
      Role: 'Assistant Professor',
      DepartmentID: deptRecords[1].DepartmentID, // Electrical Engineering
      isApproved: true
    },
  ];

  const createdFaculty = [];
  for (const faculty of facultyData) {
    const created = await prisma.faculty.upsert({
      where: { Email: faculty.Email },
      update: {},
      create: faculty,
    });
    createdFaculty.push(created);
  }
  console.log('✓ 10 Faculty members created');

  // Create Research Projects for Rajesh Kumar (Faculty 1)
  const researchProjects = [
    {
      Title: 'Machine Learning in Healthcare Systems',
      TypeID: 'research_project',
      FacultyID: createdFaculty[0].FacultyID,
      FundingAgency: 'DST India',
      StartDate: new Date('2023-01-15'),
      EndDate: new Date('2025-12-31'),
      Budget: 5000000
    },
    {
      Title: 'Deep Learning for Medical Image Analysis',
      TypeID: 'research_project',
      FacultyID: createdFaculty[0].FacultyID,
      FundingAgency: 'AICTE',
      StartDate: new Date('2022-06-01'),
      EndDate: new Date('2024-05-31'),
      Budget: 3500000
    },
    {
      Title: 'IoT based Smart Agriculture System',
      TypeID: 'research_project',
      FacultyID: createdFaculty[1].FacultyID,
      FundingAgency: 'CSIR',
      StartDate: new Date('2023-03-01'),
      EndDate: new Date('2025-02-28'),
      Budget: 2500000
    }
  ];

  for (const project of researchProjects) {
    await prisma.researchProjects.create({
      data: project
    });
  }
  console.log('✓ Research projects created');

  // Create Publications
  const publication1 = await prisma.publications.create({
    data: {
      Title: 'Advanced Machine Learning Techniques for Disease Prediction',
      TypeID: 'publication',
      PublicationYear: new Date('2024-01-01'),
      FundingAgency: 'DST India',
      JournalPublicationDetails: {
        create: {
          Name: 'IEEE Transactions on Medical Imaging',
          VolumeNumber: '43',
          IssueNumber: '2',
          ISSN_Number: 278062
        }
      }
    }
  });

  const publication2 = await prisma.publications.create({
    data: {
      Title: 'Deep Neural Networks in Healthcare: A Comprehensive Review',
      TypeID: 'publication',
      PublicationYear: new Date('2023-06-15'),
      FundingAgency: 'AICTE',
      JournalPublicationDetails: {
        create: {
          Name: 'Journal of Artificial Intelligence in Medicine',
          VolumeNumber: '128',
          IssueNumber: '3',
          ISSN_Number: 933657
        }
      }
    }
  });

  const publication3 = await prisma.publications.create({
    data: {
      Title: 'Smart Agriculture using IoT and Machine Learning',
      TypeID: 'publication',
      PublicationYear: new Date('2024-03-01'),
      FundingAgency: 'CSIR',
      ConferencePaperDetails: {
        create: {
          Publisher: 'IEEE',
          Location: 'Bangalore, India',
          PageNumbers: '1-8'
        }
      }
    }
  });

  console.log('✓ Publications created');

  // Link publications to faculty with TypeOfIndexing
  await prisma.facultyPublicationLink.createMany({
    data: [
      { 
        FacultyID: createdFaculty[0].FacultyID, 
        PublicationID: publication1.PublicationID,
        TypeOfIndexing: 'SCI'
      },
      { 
        FacultyID: createdFaculty[0].FacultyID, 
        PublicationID: publication2.PublicationID,
        TypeOfIndexing: 'Scopus'
      },
      { 
        FacultyID: createdFaculty[1].FacultyID, 
        PublicationID: publication3.PublicationID,
        TypeOfIndexing: 'SCI'
      }
    ]
  });
  console.log('✓ Faculty-Publication links created');

  // Create Awards
  const awards = [
    {
      AwardName: 'Best Research Paper Award',
      AwardingBody: 'IEEE',
      Location: 'Mumbai, India',
      YearAwarded: 2024,
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      AwardName: 'Young Scientist Award',
      AwardingBody: 'INSA',
      Location: 'New Delhi, India',
      YearAwarded: 2023,
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      AwardName: 'Excellence in Teaching Award',
      AwardingBody: 'University',
      Location: 'Bangalore, India',
      YearAwarded: 2023,
      FacultyID: createdFaculty[1].FacultyID
    }
  ];

  for (const award of awards) {
    await prisma.awards.create({
      data: award
    });
  }
  console.log('✓ Awards created');

  // Create Patents
  const patents = [
    {
      TypeID: 'patent',
      Title: 'AI-based Medical Diagnosis System',
      PatentNumber: 'IN202401234567',
      FilingDate: new Date('2023-05-15'),
      PublicationDate: new Date('2024-08-20'),
      Authority: 'Indian Patent Office',
      CollaborationInstitute: 'IIT Bombay',
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      TypeID: 'patent',
      Title: 'Smart IoT Sensor for Agriculture',
      PatentNumber: 'IN202301987654',
      FilingDate: new Date('2022-11-10'),
      PublicationDate: new Date('2024-03-15'),
      Authority: 'Indian Patent Office',
      CollaborationInstitute: null,
      FacultyID: createdFaculty[1].FacultyID
    }
  ];

  for (const patent of patents) {
    await prisma.patents.create({
      data: patent
    });
  }
  console.log('✓ Patents created');

  // Create Qualifications
  const qualifications = [
    {
      Degree: 'Ph.D. in Computer Science',
      Institution: 'IIT Bombay',
      YearOfCompletion: new Date('2015-01-01'),
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Degree: 'M.Tech in Computer Science',
      Institution: 'NIT Trichy',
      YearOfCompletion: new Date('2010-01-01'),
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Degree: 'B.Tech in Computer Science',
      Institution: 'Anna University',
      YearOfCompletion: new Date('2008-01-01'),
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Degree: 'Ph.D. in Electrical Engineering',
      Institution: 'IIT Delhi',
      YearOfCompletion: new Date('2016-01-01'),
      FacultyID: createdFaculty[1].FacultyID
    }
  ];

  for (const qual of qualifications) {
    await prisma.facultyQualification.create({
      data: qual
    });
  }
  console.log('✓ Qualifications created');

  // Create Teaching Experience (SubjectTaught)
  const subjects = [
    {
      Level: 'UG',
      SubjectName: 'Machine Learning',
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Level: 'PG',
      SubjectName: 'Deep Learning',
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Level: 'UG',
      SubjectName: 'Data Structures',
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Level: 'UG',
      SubjectName: 'Power Systems',
      FacultyID: createdFaculty[1].FacultyID
    },
    {
      Level: 'PG',
      SubjectName: 'Control Systems',
      FacultyID: createdFaculty[1].FacultyID
    }
  ];

  for (const subject of subjects) {
    await prisma.subjectTaught.create({
      data: subject
    });
  }
  console.log('✓ Teaching experience created');

  // Create Event Types first
  const eventTypes = [
    { EventID: 1, EventType: 'Conference' },
    { EventID: 2, EventType: 'Workshop' },
    { EventID: 3, EventType: 'Seminar' }
  ];

  const createdEventTypes = [];
  for (const eventType of eventTypes) {
    const created = await prisma.eventType.upsert({
      where: { EventID: eventType.EventID },
      update: {},
      create: eventType
    });
    createdEventTypes.push(created);
  }

  // Create Events
  const events = [
    {
      Event_id: createdEventTypes[0].EventID,
      Title: 'International Conference on AI and Machine Learning',
      Organizer: 'IEEE',
      StartDate: new Date('2024-02-15'),
      EndDate: new Date('2024-02-17'),
      Location: 'IIT Bombay, Mumbai',
      Description: 'Organized and chaired technical sessions',
      Role: 'Organizer',
      FundingAgency: 'DST',
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Event_id: createdEventTypes[1].EventID,
      Title: 'Workshop on Deep Learning Fundamentals',
      Organizer: 'Computer Science Department',
      StartDate: new Date('2023-09-10'),
      EndDate: new Date('2023-09-12'),
      Location: 'Current University',
      Description: 'Conducted hands-on workshop for students',
      Role: 'Speaker',
      FundingAgency: null,
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      Event_id: createdEventTypes[2].EventID,
      Title: 'National Seminar on Smart Grid Technology',
      Organizer: 'NIT Trichy',
      StartDate: new Date('2024-01-20'),
      EndDate: new Date('2024-01-20'),
      Location: 'NIT Trichy',
      Description: 'Keynote speaker on IoT in Smart Grids',
      Role: 'Speaker',
      FundingAgency: 'AICTE',
      FacultyID: createdFaculty[1].FacultyID
    }
  ];

  for (const event of events) {
    await prisma.eventsOrganised.create({
      data: event
    });
  }
  console.log('✓ Events created');

  // Create Outreach Activities
  const outreach = [
    {
      ActivityType: 'Community Service',
      ActivityTitle: 'AI Awareness Program for Rural Schools',
      InstitutionName: 'Government Schools, Karnataka',
      ActivityDate: new Date('2023-12-15'),
      Description: 'Conducted AI literacy sessions for government school students reaching 150 participants',
      FacultyID: createdFaculty[0].FacultyID
    },
    {
      ActivityType: 'Social Initiative',
      ActivityTitle: 'Technology for Social Good Initiative',
      InstitutionName: 'Rural Development Department',
      ActivityDate: new Date('2023-08-20'),
      Description: 'Developed free mobile app for farmers to get crop advice, benefited over 500 farmers in Maharashtra',
      FacultyID: createdFaculty[1].FacultyID
    }
  ];

  for (const activity of outreach) {
    await prisma.outReachActivities.create({
      data: activity
    });
  }
  console.log('✓ Outreach activities created');

  // Create Citation Metrics
  const citationMetrics = [
    {
      FacultyID: createdFaculty[0].FacultyID,
      TotalCitations: 1250,
      HIndex: 18,
      I10Index: 25,
      YearRecorded: 2024,
      Source: 'Google Scholar'
    },
    {
      FacultyID: createdFaculty[1].FacultyID,
      TotalCitations: 890,
      HIndex: 15,
      I10Index: 20,
      YearRecorded: 2024,
      Source: 'Google Scholar'
    },
    {
      FacultyID: createdFaculty[2].FacultyID,
      TotalCitations: 450,
      HIndex: 10,
      I10Index: 12,
      YearRecorded: 2024,
      Source: 'Google Scholar'
    }
  ];

  for (const citation of citationMetrics) {
    await prisma.citationMetrics.create({
      data: citation
    });
  }
  console.log('✓ Citation metrics created');

  console.log('\n==============================================');
  console.log('🎉 Seeding completed successfully!');
  console.log('==============================================');
  console.log('\n📝 Test Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Email: rajesh.kumar@university.ac.in');
  console.log('Password: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 Created Data Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✓ 10 Faculty Members');
  console.log('✓ 8 Departments');
  console.log('✓ 3 Research Projects');
  console.log('✓ 3 Publications (Journal & Conference)');
  console.log('✓ 3 Awards');
  console.log('✓ 2 Patents');
  console.log('✓ 4 Qualifications');
  console.log('✓ 3 Teaching Experiences');
  console.log('✓ 3 Events');
  console.log('✓ 2 Outreach Activities');
  console.log('✓ 3 Citation Metrics');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });