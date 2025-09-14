 CREATE TABLE IF NOT EXISTS EventsOrganised (
  EventID     SERIAL PRIMARY KEY,
  FacultyID   INT NOT NULL,
  EventType   VARCHAR(255) NOT NULL,
  Title       VARCHAR(255) NOT NULL,
  StartDate   DATE NOT NULL,
  EndDate     DATE NOT NULL,
  Description VARCHAR(255) NOT NULL,
  Role        VARCHAR(255),
  FundingAgency VARCHAR(255)

  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE,
  FOREIGN KEY (EventTypeID) REFERENCES EventType(EventTypeID) ON DELETE CASCADE
);

