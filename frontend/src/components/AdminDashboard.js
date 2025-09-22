import React, { useState } from "react";
import FacultyRequests from "./FacultyRequests";
import DepartmentManager from "./DepartmentManager";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            Faculty Requests
          </li>
          <li
            className={activeTab === "departments" ? "active" : ""}
            onClick={() => setActiveTab("departments")}
          >
            Manage Departments
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {activeTab === "requests" && <FacultyRequests />}
        {activeTab === "departments" && <DepartmentManager />}
      </main>
    </div>
  );
}
