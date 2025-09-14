  CREATE TABLE IF NOT EXISTS JournalPublicationDetails (
  PublicationID INT PRIMARY KEY,
  Name          VARCHAR(255),
  VolumeNumber  VARCHAR(50),
  IssueNumber   VARCHAR(50),
  ISSN_Number   VARCHAR(20),

  FOREIGN KEY (PublicationID) REFERENCES Publications(PublicationID) ON DELETE CASCADE
);

