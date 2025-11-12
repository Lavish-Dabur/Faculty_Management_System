import React, { useState, useEffect } from 'react';
import { facultyAPI, departmentAPI } from '../services/api';
import '../styles/retrieve.css';

const RetrievePage = ({ navigate }) => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [departments, setDepartments] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    loadFacultyData();
    loadDepartmentData();
  }, []);


  useEffect(() => {
    filterFaculty();
  }, [searchTerm, faculty, filterType, selectedDept]);

  
  const loadFacultyData = async () => {
    try {
      setLoading(true);
      setError('');
      const facultyData = await facultyAPI.getAllFaculty();
      setFaculty(facultyData);
      setFilteredFaculty(facultyData);
    } catch (error) {
      console.error('Error loading faculty data:', error);
      setError('Failed to load faculty data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const loadDepartmentData = async () => {
    try {
      const deptData = await departmentAPI.getAllDepartments();
      setDepartments(deptData);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  
  const filterFaculty = () => {
    let filtered = faculty;

    if (filterType === 'department' && selectedDept) {
      filtered = filtered.filter(
        (f) =>
          f.Department?.DepartmentName?.toLowerCase() ===
          selectedDept.toLowerCase()
      );
    }

    if (filterType === 'faculty' && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((f) =>
        f.Role?.toLowerCase().includes(searchLower)
      );
    }

    if (filterType === 'all' && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.FirstName?.toLowerCase().includes(searchLower) ||
          f.LastName?.toLowerCase().includes(searchLower) ||
          `${f.FirstName} ${f.LastName}`.toLowerCase().includes(searchLower) ||
          f.Email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredFaculty(filtered);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm('');
  const handleViewProfile = (facultyId) => navigate(`/faculty/${facultyId}`);

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'professor': return 'role-professor';
      case 'associate professor': return 'role-associate';
      case 'assistant professor': return 'role-assistant';
      case 'lecturer': return 'role-lecturer';
      default: return 'role-staff';
    }
  };

 

  if (loading) {
    return (
      <div className="retrieve-container">
        <div className="loading-spinner">Loading faculty data...</div>
      </div>
    );
  }

  return (
    <div className="retrieve-container">
      <div className="retrieve-content">
        {/* Header */}
        <div className="form-header">
          <button onClick={() => navigate('home')} className="back-button">
            ← Back
          </button>
        </div>

        {/* Page Header */}
        <div className="retrieve-header">
          <div className="retrieve-icon">👥</div>
          <div className="retrieve-title-section">
            <h1 className="retrieve-title">Faculty Directory</h1>
            <p className="retrieve-subtitle">
              Search and browse through faculty members
              {faculty.length > 0 && ` • ${faculty.length} faculty members`}
            </p>
          </div>
        </div>

        {/* 🔽 Filter Section */}
        <div className='filter-search'>
        <div className="filter-section">
          <div className="filter-container">
            {/* <label htmlFor="filterType" className="filter-label">Filter </label> */}
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSearchTerm('');
              }}
              className="filter-dropdown"
            >
      
              <option value="faculty">Faculty Name</option>
              <option value="department">Department</option>
            </select>

            
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="form-input-wrapper">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder={
                  filterType === 'faculty'
                    ? 'Search by Faculty name'
                    : 'Search by Department name'
                }
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={handleClearSearch} className="clear-search-button">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={loadFacultyData} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Faculty Table */}
        <div className="data-table-container">
          {filteredFaculty.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{searchTerm ? '🔍' : '👥'}</div>
              <h3>
                {searchTerm || selectedDept
                  ? 'No faculty found'
                  : 'No faculty members'}
              </h3>
              <button
                onClick={() => {
                  handleClearSearch();
                  setSelectedDept('');
                  setFilterType('all');
                }}
                className="primary-button"
              >
                View All Faculty
              </button>
            </div>
          ) : (
            <>
              <div className="data-table">
                <div className="table-header">
                  <div className="header-name">Name</div>
                  <div className="header-email">Email</div>
                  <div className="header-role">Role</div>
                  <div className="header-department">Department</div>
                  <div className="header-actions">Actions</div>
                </div>

                <div className="table-body">
                  {filteredFaculty.map((f) => (
                    <div key={f.FacultyID} className="table-row">
                      <div className="cell-name">
                        <div className="faculty-avatar">
                          {f.FirstName?.charAt(0)}
                          {f.LastName?.charAt(0)}
                        </div>
                        <div className="faculty-name">
                          <strong>{f.FirstName} {f.LastName}</strong>
                          {f.Phone_no && <span className="faculty-phone">{f.Phone_no}</span>}
                        </div>
                      </div>

                      <div className="cell-email">
                        <span className="email-text">{f.Email}</span>
                      </div>

                      <div className="cell-role">
                        <span className={`role-badge ${getRoleClass(f.Role)}`}>
                          <span className="role-icon">{getRoleIcon(f.Role)}</span>
                          {f.Role}
                        </span>
                      </div>

                      <div className="cell-department">
                        <span className="department-badge">
                          {f.Department?.DepartmentName || 'Not assigned'}
                        </span>
                      </div>

                      <div className="cell-actions">
                        <button
                          onClick={() => handleViewProfile(f.FacultyID)}
                          className="view-profile-button"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="table-footer">
                <div className="footer-info">
                  Showing {filteredFaculty.length} of {faculty.length} faculty members
                </div>
                <div className="footer-actions">
                  <button className="export-button">📊 Export Data</button>
                  <button onClick={loadFacultyData} className="refresh-button">
                    🔄 Refresh
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetrievePage;
