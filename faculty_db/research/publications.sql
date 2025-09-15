  CREATE TABLE IF NOT EXISTS Publications (
  PublicationID   SERIAL PRIMARY KEY,
  TypeID          INT NOT NULL,
  Authors         TEXT NOT NULL,
  Title           VARCHAR(500) NOT NULL,
  PublicationYear DATE NOT NULL,
  FundingAgency   VARCHAR(255),

  FOREIGN KEY (TypeID) REFERENCES TYPES(TypeID) ON DELETE CASCADE
);

