import React, { useState, useEffect } from "react";
import DepartmentManager from "./DepartmentManager";
import "./AdminDashboard.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

export default function AdminDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");
  const [userRole, setUserRole] = useState("");

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.Role);
    
    if (user.Role !== "Admin") {
      alert("Access denied. Admin privileges required.");
      window.location.href = "/";
      return;
    }
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You are not logged in");
        window.location.href = "/";
        return;
      }

      console.log("Fetching from:", `${API_BASE_URL}/api/admin/pending`);
      console.log("Token:", token ? "Present" : "Missing");

      const res = await fetch(`${API_BASE_URL}/api/admin/pending`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", res.status);
      
      if (res.status === 403) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Access forbidden. Admin privileges required.");
      }
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "requests" && userRole === "Admin") {
      fetchPending();
    }
  }, [activeTab, userRole]);

  const handleApprove = async (facultyId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/approve/${facultyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        throw new Error("You don't have permission to approve faculty");
      }

      if (!res.ok) {
        throw new Error(`Approval failed: ${res.status}`);
      }

      const data = await res.json();
      alert("Faculty approved successfully!");
      fetchPending();
    } catch (err) {
      alert("Error approving faculty: " + err.message);
    }
  };

  const handleReject = async (facultyId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/reject/${facultyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        throw new Error("You don't have permission to reject faculty");
      }

      if (!res.ok) {
        throw new Error(`Rejection failed: ${res.status}`);
      }

      alert("Faculty request rejected!");
      fetchPending();
    } catch (err) {
      alert("Error rejecting faculty: " + err.message);
    }
  };

  if (userRole && userRole !== "Admin") {
    return (
      <div className="admin-dashboard">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Access Denied</h2>
          <p>You need Admin privileges to access this page.</p>
          <button onClick={() => window.location.href = "/"}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Logged in as: {userRole}
        </p>
        <ul>
          <li className={activeTab === "requests" ? "active" : ""} 
              onClick={() => setActiveTab("requests")}>
            Faculty Requests
          </li>
          <li className={activeTab === "departments" ? "active" : ""} 
              onClick={() => setActiveTab("departments")}>
            Manage Departments
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {activeTab === "requests" && (
          <div className="faculty-requests">
            <h2>Pending Faculty Requests</h2>
            
            {loading && <p>Loading pending requests...</p>}
            
            {error && (
              <div className="error-container">
                <p style={{ color: "red" }}>Error: {error}</p>
                <div style={{ margin: "10px 0" }}>
                  <button onClick={fetchPending} className="retry-btn">
                    Retry Connection
                  </button>
                </div>
                <details style={{ textAlign: "left", marginTop: "10px" }}>
                  <summary>Debug Information</summary>
                  <p>Backend URL: {API_BASE_URL}</p>
                  <p>User Role: {userRole}</p>
                  <p>Token: {localStorage.getItem("token") ? "Present" : "Missing"}</p>
                </details>
              </div>
            )}
            
            {!loading && !error && pendingRequests.length === 0 && (
              <p>No pending faculty requests.</p>
            )}
            
            {!loading && !error && pendingRequests.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((faculty) => (
                    <tr key={faculty.FacultyID}>
                      <td>{faculty.FirstName} {faculty.LastName}</td>
                      <td>{faculty.Email}</td>
                      <td>{faculty.Role}</td>
                      <td>{faculty.Department?.DepartmentName || "N/A"}</td>
                      <td className="actions">
                        <button
                          onClick={() => handleApprove(faculty.FacultyID)}
                          className="approve-btn"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(faculty.FacultyID)}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "departments" && <DepartmentManager />}
      </main>
    </div>
  );
}