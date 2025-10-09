// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/dashboard.css';

const AdminDashboard = ({ user, navigate }) => {
  const [stats, setStats] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedFaculty, setApprovedFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  
  // Form states
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [departmentForm, setDepartmentForm] = useState({ departmentName: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all data in parallel
      const [pendingData, facultyData, departmentsData, statsData] = await Promise.all([
        adminAPI.getPendingRequests(),
        adminAPI.getApprovedFaculty(),
        adminAPI.getDepartments(),
        adminAPI.getDashboardStats()
      ]);
      
      setPendingRequests(pendingData);
      setApprovedFaculty(facultyData);
      setDepartments(departmentsData);
      setStats(statsData);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (facultyId, facultyName) => {
    if (window.confirm(`Approve ${facultyName}? This will add them to the system.`)) {
      try {
        setActionLoading(true);
        await adminAPI.approveFaculty(facultyId);
        alert(`${facultyName} approved successfully!`);
        await loadDashboardData(); // Refresh all data
      } catch (error) {
        alert('Error approving faculty: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async (facultyId, facultyName) => {
    if (window.confirm(`Reject ${facultyName}'s application? This action cannot be undone.`)) {
      try {
        setActionLoading(true);
        await adminAPI.rejectFaculty(facultyId);
        alert(`${facultyName} rejected successfully!`);
        await loadDashboardData(); // Refresh all data
      } catch (error) {
        alert('Error rejecting faculty: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!departmentForm.departmentName.trim()) {
      alert('Please enter a department name');
      return;
    }

    try {
      setActionLoading(true);
      await adminAPI.addDepartment(departmentForm.departmentName);
      alert(`Department "${departmentForm.departmentName}" added successfully!`);
      setDepartmentForm({ departmentName: '' });
      setShowDepartmentForm(false);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      alert('Error adding department: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDepartment = async (departmentId, departmentName) => {
    if (window.confirm(`Delete department "${departmentName}"? This action cannot be undone.`)) {
      try {
        setActionLoading(true);
        await adminAPI.deleteDepartment(departmentId);
        alert(`Department "${departmentName}" deleted successfully!`);
        await loadDashboardData(); // Refresh data
      } catch (error) {
        alert('Error deleting department: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleViewFaculty = (facultyId) => {
    // Navigate to faculty profile view
    navigate(`/faculty/${facultyId}`);
  };

  const handleEditFaculty = (facultyId) => {
    // Navigate to faculty edit page
    navigate(`/faculty/${facultyId}/edit`);
  };

  const handleTransferDepartment = (facultyId, facultyName) => {
    // Implement department transfer logic
    alert(`Transfer ${facultyName} to another department - Feature coming soon!`);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.firstname} {user?.lastname}</p>
        {error && (
          <div className="error-message" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          disabled={actionLoading}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
          disabled={actionLoading}
        >
          ⏳ Pending ({pendingRequests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'faculty' ? 'active' : ''}`}
          onClick={() => setActiveTab('faculty')}
          disabled={actionLoading}
        >
          👥 Faculty ({approvedFaculty.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('departments')}
          disabled={actionLoading}
        >
          🏛️ Departments ({departments.length})
        </button>
      </div>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Processing...</div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalFaculty || 0}</h3>
                <p>Total Faculty</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingApprovals || 0}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔬</div>
              <div className="stat-info">
                <h3>{stats.totalResearch || 0}</h3>
                <p>Research Projects</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.totalPublications || 0}</h3>
                <p>Publications</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏛️</div>
              <div className="stat-info">
                <h3>{stats.totalDepartments || 0}</h3>
                <p>Departments</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button 
                className="action-card"
                onClick={() => setActiveTab('approvals')}
                disabled={actionLoading}
              >
                <div className="action-icon">✅</div>
                <span>Review Applications</span>
                {pendingRequests.length > 0 && (
                  <span className="badge">{pendingRequests.length}</span>
                )}
              </button>
              <button 
                className="action-card"
                onClick={() => setActiveTab('faculty')}
                disabled={actionLoading}
              >
                <div className="action-icon">👥</div>
                <span>Manage Faculty</span>
              </button>
              <button 
                className="action-card"
                onClick={() => setActiveTab('departments')}
                disabled={actionLoading}
              >
                <div className="action-icon">🏛️</div>
                <span>Manage Departments</span>
              </button>
              <button 
                className="action-card"
                onClick={() => loadDashboardData()}
                disabled={actionLoading}
              >
                <div className="action-icon">🔄</div>
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {pendingRequests.length > 0 ? (
                <div className="activity-item urgent">
                  <div className="activity-icon">⏳</div>
                  <div className="activity-content">
                    <p><strong>{pendingRequests.length} pending faculty approvals</strong></p>
                    <p>Review and approve new faculty applications</p>
                  </div>
                  <button 
                    className="action-btn view"
                    onClick={() => setActiveTab('approvals')}
                  >
                    Review
                  </button>
                </div>
              ) : (
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <p>All faculty applications have been processed</p>
                  </div>
                </div>
              )}
              
              <div className="activity-item">
                <div className="activity-icon">🏛️</div>
                <div className="activity-content">
                  <p><strong>{departments.length} departments</strong> with <strong>{approvedFaculty.length} faculty members</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="approvals-content">
          <div className="section-header">
            <h2>Pending Faculty Approvals</h2>
            <p>Review and approve new faculty applications</p>
          </div>
          
          {pendingRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>No pending approvals</h3>
              <p>All faculty applications have been processed.</p>
            </div>
          ) : (
            <div className="requests-table">
              {pendingRequests.map((request) => (
                <div key={request.FacultyID} className="request-card">
                  <div className="request-info">
                    <h4>{request.FirstName} {request.LastName}</h4>
                    <p><strong>Email:</strong> {request.Email}</p>
                    <p><strong>Department:</strong> {request.Department?.DepartmentName || 'Not assigned'}</p>
                    <p><strong>Role:</strong> {request.Role}</p>
                    <p className="request-date">Applied: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="request-actions">
                    <PrimaryButton 
                      onClick={() => handleApprove(request.FacultyID, `${request.FirstName} ${request.LastName}`)}
                      color="bg-green-600"
                      small={true}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Approve'}
                    </PrimaryButton>
                    <button 
                      onClick={() => handleReject(request.FacultyID, `${request.FirstName} ${request.LastName}`)}
                      className="reject-button"
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approved Faculty Tab */}
      {activeTab === 'faculty' && (
        <div className="faculty-content">
          <div className="section-header">
            <h2>Approved Faculty Members</h2>
            <p>Total: {approvedFaculty.length} faculty members across {departments.length} departments</p>
          </div>
          
          {approvedFaculty.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No faculty members</h3>
              <p>No faculty members have been approved yet.</p>
              <button 
                className="primary-button bg-indigo-600"
                onClick={() => setActiveTab('approvals')}
              >
                Review Pending Applications
              </button>
            </div>
          ) : (
            <div className="faculty-table-container">
              <div className="faculty-table">
                <div className="table-header">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Department</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {approvedFaculty.map((faculty) => (
                  <div key={faculty.FacultyID} className="table-row">
                    <div className="faculty-name">
                      <strong>{faculty.FirstName} {faculty.LastName}</strong>
                    </div>
                    <div className="faculty-email">{faculty.Email}</div>
                    <div className="faculty-department">
                      <span className="department-badge">
                        {faculty.Department?.DepartmentName || 'Not assigned'}
                      </span>
                    </div>
                    <div className="faculty-role">
                      <span className={`role-badge ${faculty.Role.toLowerCase()}`}>
                        {faculty.Role}
                      </span>
                    </div>
                    <div className="faculty-status">
                      <span className="status-badge approved">Approved</span>
                    </div>
                    <div className="faculty-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewFaculty(faculty.FacultyID)}
                      >
                        View
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditFaculty(faculty.FacultyID)}
                      >
                        Edit
                      </button>
                      <button 
                        className="action-btn transfer"
                        onClick={() => handleTransferDepartment(faculty.FacultyID, `${faculty.FirstName} ${faculty.LastName}`)}
                      >
                        Transfer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="departments-content">
          <div className="section-header">
            <div>
              <h2>Department Management</h2>
              <p>Manage academic departments and faculty assignments</p>
            </div>
            <button 
              className="add-button" 
              onClick={() => setShowDepartmentForm(!showDepartmentForm)}
              disabled={actionLoading}
            >
              {showDepartmentForm ? '❌ Cancel' : '➕ Add Department'}
            </button>
          </div>

          {/* Add Department Form */}
          {showDepartmentForm && (
            <div className="form-card">
              <h3>Add New Department</h3>
              <form onSubmit={handleAddDepartment} className="department-form">
                <div className="form-field">
                  <label>Department Name *</label>
                  <input
                    type="text"
                    value={departmentForm.departmentName}
                    onChange={(e) => setDepartmentForm({ departmentName: e.target.value })}
                    placeholder="Enter department name"
                    required
                    className="form-input"
                    disabled={actionLoading}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Adding...' : '💾 Add Department'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowDepartmentForm(false)}
                    className="cancel-button"
                    disabled={actionLoading}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments List */}
          {departments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏛️</div>
              <h3>No departments</h3>
              <p>No departments have been created yet.</p>
              <button 
                className="primary-button bg-indigo-600"
                onClick={() => setShowDepartmentForm(true)}
              >
                Create First Department
              </button>
            </div>
          ) : (
            <div className="departments-grid">
              {departments.map((department) => (
                <div key={department.DepartmentID} className="department-card">
                  <div className="department-header">
                    <h3>{department.DepartmentName}</h3>
                    <span className="faculty-count">
                      {department.facultyCount} faculty
                    </span>
                  </div>
                  
                  <div className="department-info">
                    <p><strong>Department ID:</strong> {department.DepartmentID}</p>
                    <p><strong>Faculty Members:</strong> {department.facultyCount}</p>
                  </div>

                  {/* Faculty in this department */}
                  <div className="department-faculty">
                    <h4>Faculty Members:</h4>
                    {approvedFaculty
                      .filter(faculty => faculty.Department?.DepartmentName === department.DepartmentName)
                      .map(faculty => (
                        <div key={faculty.FacultyID} className="faculty-item">
                          <span>{faculty.FirstName} {faculty.LastName}</span>
                          <span className={`faculty-role ${faculty.Role.toLowerCase()}`}>
                            {faculty.Role}
                          </span>
                        </div>
                      ))}
                    
                    {approvedFaculty.filter(faculty => 
                      faculty.Department?.DepartmentName === department.DepartmentName
                    ).length === 0 && (
                      <p className="no-faculty">No faculty assigned to this department</p>
                    )}
                  </div>

                  <div className="department-actions">
                    <button className="action-btn edit">Edit</button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteDepartment(department.DepartmentID, department.DepartmentName)}
                      disabled={actionLoading || department.facultyCount > 0}
                    >
                      {actionLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  
                  {department.facultyCount > 0 && (
                    <div className="department-warning">
                      ⚠️ Cannot delete - department has faculty members
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;