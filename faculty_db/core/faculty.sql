 CREATE TABLE IF NOT EXISTS Faculty (
  FacultyID SERIAL PRIMARY KEY,
  FirstName VARCHAR(100) NOT NULL,
  LastName  VARCHAR(100) NOT NULL,
  Gender    VARCHAR(10) CHECK (Gender IN ('Male','Female','Other')),
  DOB       DATE NOT NULL,
  Role      VARCHAR(50) NOT NULL,
  Phone_no  VARCHAR(20) NOT NULL,
  Email     VARCHAR(120) UNIQUE NOT NULL,
  DepartmentID INT NOT NULL,
  
  FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID) 
  ON DELETE CASCADE ON UPDATE CASCADE
);

