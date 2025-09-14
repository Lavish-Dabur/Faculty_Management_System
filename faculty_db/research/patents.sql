CREATE TABLE IF NOT EXISTS Patents (
  PatentID              SERIAL PRIMARY KEY,
  FacultyID             INT NOT NULL,
  Title                 VARCHAR(255) NOT NULL,
  FilingDate            DATE NOT NULL,
  PublicationDate       DATE,
  PatentNumber          VARCHAR(100) NOT NULL,
  Authority             VARCHAR(100),
  CollaborationInstitute VARCHAR(150),

  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);
