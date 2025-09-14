  CREATE TABLE IF NOT EXISTS ResearchProjects (
  ProjectID     SERIAL PRIMARY KEY,
  FacultyID     INT NOT NULL,
  Title         VARCHAR(255) NOT NULL,
  StartDate     DATE NOT NULL,
  EndDate       DATE,
  FundingAgency VARCHAR(255),
  GrantAmount   DECIMAL(15,2),

  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

