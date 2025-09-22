import React, { useState } from "react";
import "./FacultyRequests.css";

const dummyRequests = [
  { id: 1, name: "Dr. John Doe", email: "john@example.com", department: "CS" },
  { id: 2, name: "Dr. Jane Smith", email: "jane@example.com", department: "Math" },
];

export default function FacultyRequests() {
  const [requests, setRequests] = useState(dummyRequests);

  const approve = (id) => {
    setRequests(requests.filter(req => req.id !== id));
    alert("Faculty Approved!");
  };

  const reject = (id) => {
    setRequests(requests.filter(req => req.id !== id));
    alert("Faculty Rejected!");
  };

  return (
    <div className="faculty-requests">
      <h2>Pending Faculty Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.department}</td>
                <td>
                  <button className="approve-btn" onClick={() => approve(req.id)}>Approve</button>
                  <button className="reject-btn" onClick={() => reject(req.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
