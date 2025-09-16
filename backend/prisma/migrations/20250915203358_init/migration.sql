-- CreateEnum
CREATE TYPE "public"."event_type" AS ENUM ('Workshop', 'Seminar', 'Conference', 'Other');

-- CreateEnum
CREATE TYPE "public"."role_type" AS ENUM ('Speaker', 'Attendee', 'Organizer');

-- CreateEnum
CREATE TYPE "public"."publication_type" AS ENUM ('publication', 'patent', 'research_project');

-- CreateTable
CREATE TABLE "public"."Department" (
    "DepartmentID" SERIAL NOT NULL,
    "DepartmentName" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("DepartmentID")
);

-- CreateTable
CREATE TABLE "public"."Faculty" (
    "FacultyID" SERIAL NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "Role" TEXT NOT NULL,
    "Phone_no" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "DepartmentID" INTEGER NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("FacultyID")
);

-- CreateTable
CREATE TABLE "public"."SubjectTaught" (
    "FacultyID" INTEGER NOT NULL,
    "Level" TEXT NOT NULL,
    "SubjectName" TEXT NOT NULL,
    "CourseCode" TEXT,
    "ProgramName" TEXT,
    "Note" TEXT,

    CONSTRAINT "SubjectTaught_pkey" PRIMARY KEY ("FacultyID","Level","SubjectName")
);

-- CreateTable
CREATE TABLE "public"."FacultyQualification" (
    "QualificationID" SERIAL NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "Degree" TEXT NOT NULL,
    "Institution" TEXT NOT NULL,
    "YearOfCompletion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyQualification_pkey" PRIMARY KEY ("QualificationID")
);

-- CreateTable
CREATE TABLE "public"."OutReachActivities" (
    "ActivityID" SERIAL NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "ActivityType" TEXT NOT NULL,
    "ActivityTitle" TEXT NOT NULL,
    "InstitutionName" TEXT,
    "ActivityDate" TIMESTAMP(3) NOT NULL,
    "Description" TEXT,

    CONSTRAINT "OutReachActivities_pkey" PRIMARY KEY ("ActivityID")
);

-- CreateTable
CREATE TABLE "public"."EventType" (
    "EventID" INTEGER NOT NULL,
    "EventType" "public"."event_type" NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("EventID")
);

-- CreateTable
CREATE TABLE "public"."EventsOrganised" (
    "FacultyID" INTEGER NOT NULL,
    "Event_id" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Organizer" TEXT,
    "Location" TEXT,
    "StartDate" TIMESTAMP(3),
    "EndDate" TIMESTAMP(3),
    "Description" TEXT,
    "Role" "public"."role_type",
    "FundingAgency" TEXT,

    CONSTRAINT "EventsOrganised_pkey" PRIMARY KEY ("FacultyID","Event_id")
);

-- CreateTable
CREATE TABLE "public"."Awards" (
    "AwardID" SERIAL NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "AwardName" TEXT NOT NULL,
    "AwardingBody" TEXT,
    "Location" TEXT,
    "YearAwarded" INTEGER NOT NULL,

    CONSTRAINT "Awards_pkey" PRIMARY KEY ("AwardID")
);

-- CreateTable
CREATE TABLE "public"."TeachingExperience" (
    "ExperienceID" SERIAL NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "OrganizationName" TEXT NOT NULL,
    "Designation" TEXT NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TEXT,
    "NatureOfWork" TEXT,

    CONSTRAINT "TeachingExperience_pkey" PRIMARY KEY ("ExperienceID")
);

-- CreateTable
CREATE TABLE "public"."CitationMetrics" (
    "MetricsID" SERIAL NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "YearRecorded" INTEGER NOT NULL,
    "Source" TEXT NOT NULL,
    "HIndex" INTEGER,
    "I10Index" INTEGER,
    "TotalCitations" INTEGER,
    "ImpactFactor" DECIMAL(65,30),

    CONSTRAINT "CitationMetrics_pkey" PRIMARY KEY ("MetricsID")
);

-- CreateTable
CREATE TABLE "public"."TYPES" (
    "TypeID" TEXT NOT NULL,
    "Type" "public"."publication_type" NOT NULL,
    "Status" TEXT,

    CONSTRAINT "TYPES_pkey" PRIMARY KEY ("TypeID")
);

-- CreateTable
CREATE TABLE "public"."Publications" (
    "PublicationID" SERIAL NOT NULL,
    "TypeID" TEXT NOT NULL,
    "Authors" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "PublicationYear" TIMESTAMP(3) NOT NULL,
    "FundingAgency" TEXT,

    CONSTRAINT "Publications_pkey" PRIMARY KEY ("PublicationID")
);

-- CreateTable
CREATE TABLE "public"."JournalPublicationDetails" (
    "PublicationID" INTEGER NOT NULL,
    "Name" TEXT,
    "VolumeNumber" TEXT,
    "IssueNumber" TEXT,
    "ISSN_Number" INTEGER,

    CONSTRAINT "JournalPublicationDetails_pkey" PRIMARY KEY ("PublicationID")
);

-- CreateTable
CREATE TABLE "public"."BookPublicationDetails" (
    "PublicationID" INTEGER NOT NULL,
    "Publisher" TEXT,
    "Edition" TEXT,
    "VolumeNumber" TEXT,
    "ISBN_Number" TEXT,

    CONSTRAINT "BookPublicationDetails_pkey" PRIMARY KEY ("PublicationID")
);

-- CreateTable
CREATE TABLE "public"."ConferencePaperDetails" (
    "PublicationID" INTEGER NOT NULL,
    "Publisher" TEXT,
    "Location" TEXT,
    "PageNumbers" TEXT,

    CONSTRAINT "ConferencePaperDetails_pkey" PRIMARY KEY ("PublicationID")
);

-- CreateTable
CREATE TABLE "public"."FacultyPublicationLink" (
    "PublicationID" INTEGER NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "TypeOfIndexing" TEXT,

    CONSTRAINT "FacultyPublicationLink_pkey" PRIMARY KEY ("PublicationID","FacultyID")
);

-- CreateTable
CREATE TABLE "public"."Patents" (
    "TypeID" TEXT NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "FilingDate" TIMESTAMP(3) NOT NULL,
    "PublicationDate" TIMESTAMP(3),
    "PatentNumber" TEXT NOT NULL,
    "Authority" TEXT,
    "CollaborationInstitute" TEXT,

    CONSTRAINT "Patents_pkey" PRIMARY KEY ("TypeID","FacultyID")
);

-- CreateTable
CREATE TABLE "public"."ResearchProjects" (
    "TypeID" TEXT NOT NULL,
    "FacultyID" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "FundingAgency" TEXT,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3),
    "Budget" DECIMAL(65,30),

    CONSTRAINT "ResearchProjects_pkey" PRIMARY KEY ("TypeID","FacultyID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_Email_key" ON "public"."Faculty"("Email");

-- AddForeignKey
ALTER TABLE "public"."Faculty" ADD CONSTRAINT "Faculty_DepartmentID_fkey" FOREIGN KEY ("DepartmentID") REFERENCES "public"."Department"("DepartmentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectTaught" ADD CONSTRAINT "SubjectTaught_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacultyQualification" ADD CONSTRAINT "FacultyQualification_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutReachActivities" ADD CONSTRAINT "OutReachActivities_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventsOrganised" ADD CONSTRAINT "EventsOrganised_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventsOrganised" ADD CONSTRAINT "EventsOrganised_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES "public"."EventType"("EventID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Awards" ADD CONSTRAINT "Awards_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeachingExperience" ADD CONSTRAINT "TeachingExperience_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CitationMetrics" ADD CONSTRAINT "CitationMetrics_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Publications" ADD CONSTRAINT "Publications_TypeID_fkey" FOREIGN KEY ("TypeID") REFERENCES "public"."TYPES"("TypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JournalPublicationDetails" ADD CONSTRAINT "JournalPublicationDetails_PublicationID_fkey" FOREIGN KEY ("PublicationID") REFERENCES "public"."Publications"("PublicationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookPublicationDetails" ADD CONSTRAINT "BookPublicationDetails_PublicationID_fkey" FOREIGN KEY ("PublicationID") REFERENCES "public"."Publications"("PublicationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConferencePaperDetails" ADD CONSTRAINT "ConferencePaperDetails_PublicationID_fkey" FOREIGN KEY ("PublicationID") REFERENCES "public"."Publications"("PublicationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacultyPublicationLink" ADD CONSTRAINT "FacultyPublicationLink_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacultyPublicationLink" ADD CONSTRAINT "FacultyPublicationLink_PublicationID_fkey" FOREIGN KEY ("PublicationID") REFERENCES "public"."Publications"("PublicationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Patents" ADD CONSTRAINT "Patents_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Patents" ADD CONSTRAINT "Patents_TypeID_fkey" FOREIGN KEY ("TypeID") REFERENCES "public"."TYPES"("TypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResearchProjects" ADD CONSTRAINT "ResearchProjects_FacultyID_fkey" FOREIGN KEY ("FacultyID") REFERENCES "public"."Faculty"("FacultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResearchProjects" ADD CONSTRAINT "ResearchProjects_TypeID_fkey" FOREIGN KEY ("TypeID") REFERENCES "public"."TYPES"("TypeID") ON DELETE RESTRICT ON UPDATE CASCADE;
