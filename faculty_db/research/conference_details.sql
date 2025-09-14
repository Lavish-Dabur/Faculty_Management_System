  CREATE TABLE IF NOT EXISTS ConferencePaperDetails (
  PublicationID INT PRIMARY KEY,
  Publisher     VARCHAR(255),
  Location      VARCHAR(255),
  PageNumbers   VARCHAR(50),

  FOREIGN KEY (PublicationID) REFERENCES Publications(PublicationID) ON DELETE CASCADE
);

