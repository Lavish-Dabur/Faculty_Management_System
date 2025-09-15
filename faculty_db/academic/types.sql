 CREATE TYPE IF NOT EXISTS publication_type AS ENUM('publication','patent','research_project');

CREATE TABLE IF NOT EXISTS TYPES (
  TypeID SERIAL PRIMARY KEY,
  Type   publication_type NOT NULL,
  Status VARCHAR(50)
);

