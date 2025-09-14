  CREATE TABLE IF NOT EXISTS SubjectTaught (
  FacultyID    INT NOT NULL,
  Level        VARCHAR(10) NOT NULL CHECK (Level IN ('UG','PG')),
  SubjectName  VARCHAR(255) NOT NULL,
  CourseCode   VARCHAR(20),
  ProgramName  VARCHAR(255),
  Note         TEXT,
  
  PRIMARY KEY (FacultyID, Level, SubjectName),
  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

