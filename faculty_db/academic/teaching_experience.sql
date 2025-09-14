CREATE TABLE IF NOT EXISTS TeachingExperience (
  ExperienceID SERIAL PRIMARY KEY,
  FacultyID    INT NOT NULL,
  Institution  VARCHAR(255) NOT NULL,
  Position     VARCHAR(100) NOT NULL,
  StartDate    DATE NOT NULL,
  EndDate      DATE,

  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

