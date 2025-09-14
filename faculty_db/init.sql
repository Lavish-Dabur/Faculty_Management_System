CREATE DATABASE IF NOT EXISTS faculty_db;
\c faculty_db;

-- Core
\i core/department.sql
\i core/faculty.sql

-- Academic
\i academic/qualification.sql
\i academic/subject_taught.sql
\i academic/teaching_experience.sql

-- Research
\i research/types.sql
\i research/publications.sql
\i research/journal_details.sql
\i research/book_details.sql
\i research/conference_details.sql
\i research/faculty_publication_link.sql
\i research/patents.sql
\i research/research_projects.sql
\i research/citation_metrics.sql

-- Activities
\i activities/outreach.sql
\i activities/event_type.sql
\i activities/events_organised.sql
\i activities/awards.sql

