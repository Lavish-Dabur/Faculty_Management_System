CREATE TABLE IF NOT EXISTS Awards (
  AwardID      SERIAL PRIMARY KEY,
  FacultyID    INT NOT NULL,
  AwardName    VARCHAR(255) NOT NULL,
  AwardingBody VARCHAR(255),
  Location     VARCHAR(100),
  YearAwarded  INT NOT NULL,

  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

