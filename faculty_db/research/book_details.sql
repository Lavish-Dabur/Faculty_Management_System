  CREATE TABLE IF NOT EXISTS BookPublicationDetails (
  PublicationID INT PRIMARY KEY,
  Publisher     VARCHAR(255),
  Edition       VARCHAR(50),
  VolumeNumber  VARCHAR(50),
  ISBN_Number   VARCHAR(50),

  FOREIGN KEY (PublicationID) REFERENCES Publications(PublicationID) ON DELETE CASCADE
);

