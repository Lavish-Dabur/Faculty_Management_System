 CREATE TABLE IF NOT EXISTS FacultyQualification (
  QualificationID  SERIAL PRIMARY KEY,
  FacultyID        INT NOT NULL,
  Degree           VARCHAR(255) NOT NULL,
  Institution      VARCHAR(255) NOT NULL,
  YearOfCompletion DATE NOT NULL,
  
  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

