  CREATE TABLE IF NOT EXISTS FacultyPublicationLink (
  PublicationID  INT NOT NULL,
  FacultyID      INT NOT NULL,
  TypeOfIndexing VARCHAR(255),

  PRIMARY KEY (PublicationID, FacultyID),
  FOREIGN KEY (PublicationID) REFERENCES Publications(PublicationID) ON DELETE CASCADE,
  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

