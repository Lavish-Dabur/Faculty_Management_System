import React, { useState } from "react";
import "./DepartmentManager.css";

const initialDepartments = ["Computer Science", "Mathematics", "Physics"];

export default function DepartmentManager() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [newDept, setNewDept] = useState("");

  const addDepartment = () => {
    if(newDept.trim() && !departments.includes(newDept)){
      setDepartments([...departments, newDept]);
      setNewDept("");
    }
  };

  const removeDepartment = (dept) => {
    setDepartments(departments.filter(d => d !== dept));
  };

  return (
    <div className="department-manager">
      <h2>Manage Departments</h2>
      <div className="add-dept">
        <input
          type="text"
          placeholder="New Department"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
        />
        <button onClick={addDepartment}>Add</button>
      </div>
      <ul>
        {departments.map(dept => (
          <li key={dept}>
            {dept} <button onClick={() => removeDepartment(dept)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
