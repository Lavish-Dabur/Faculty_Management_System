 CREATE TABLE IF NOT EXISTS CitationMetrics (
  MetricID     SERIAL PRIMARY KEY,
  FacultyID    INT NOT NULL,
  hIndex       INT DEFAULT 0,
  i10Index     INT DEFAULT 0,
  TotalCitations INT DEFAULT 0,
  Source       VARCHAR(255),

  FOREIGN KEY (FacultyID) REFERENCES Faculty(FacultyID) ON DELETE CASCADE
);

