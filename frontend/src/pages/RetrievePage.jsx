import React, { useState, useEffect } from 'react';
import { facultyAPI } from '../services/api';
import '../styles/retrieve.css';

const RetrievePage = ({ navigate }) => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFacultyData();
  }, []);

  useEffect(() => {
    filterFaculty();
  }, [searchTerm, faculty]);

  const loadFacultyData = async () => {
    try {
      setLoading(true);
      setError('');
      // This would need to be implemented in your API service
      const facultyData = await facultyAPI.getAllFaculty();
      setFaculty(facultyData);
    } catch (error) {
      console.error('Error loading faculty data:', error);
      setError('Failed to load faculty data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterFaculty = () => {
    if (!searchTerm.trim()) {
      setFilteredFaculty(faculty);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = faculty.filter(facultyMember => 
      facultyMember.FirstName?.toLowerCase().includes(searchLower) ||
      facultyMember.LastName?.toLowerCase().includes(searchLower) ||
      `${facultyMember.FirstName} ${facultyMember.LastName}`.toLowerCase().includes(searchLower) ||
      facultyMember.Email?.toLowerCase().includes(searchLower)
    );
    setFilteredFaculty(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleViewProfile = (facultyId) => {
    navigate(`/faculty/${facultyId}`);
  };

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

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'professor': return '🎓';
      case 'associate professor': return '📚';
      case 'assistant professor': return '📖';
      case 'lecturer': return '✏️';
      default: return '👤';
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
          <button 
            onClick={() => navigate('home')}
            className="back-button"
          >
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

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="form-input-wrapper">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search faculty by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="clear-search-button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="search-results-info">
              <span>
                Found {filteredFaculty.length} result{filteredFaculty.length !== 1 ? 's' : ''} for "{searchTerm}"
              </span>
              <button 
                onClick={handleClearSearch}
                className="clear-all-button"
              >
                Clear search
              </button>
            </div>
          )}
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
              <div className="empty-icon">
                {searchTerm ? '🔍' : '👥'}
              </div>
              <h3>
                {searchTerm ? 'No faculty found' : 'No faculty members'}
              </h3>
              
              {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="primary-button"
                >
                  View All Faculty
                </button>
              )}
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
                  {filteredFaculty.map((facultyMember) => (
                    <div key={facultyMember.FacultyID} className="table-row">
                      <div className="cell-name">
                        <div className="faculty-avatar">
                          {facultyMember.FirstName?.charAt(0)}{facultyMember.LastName?.charAt(0)}
                        </div>
                        <div className="faculty-name">
                          <strong>{facultyMember.FirstName} {facultyMember.LastName}</strong>
                          {facultyMember.Phone_no && (
                            <span className="faculty-phone">{facultyMember.Phone_no}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="cell-email">
                        <span className="email-text">{facultyMember.Email}</span>
                      </div>
                      
                      <div className="cell-role">
                        <span className={`role-badge ${getRoleClass(facultyMember.Role)}`}>
                          <span className="role-icon">{getRoleIcon(facultyMember.Role)}</span>
                          {facultyMember.Role}
                        </span>
                      </div>
                      
                      <div className="cell-department">
                        <span className="department-badge">
                          {facultyMember.Department?.DepartmentName || 'Not assigned'}
                        </span>
                      </div>
                      
                      <div className="cell-actions">
                        <button 
                          onClick={() => handleViewProfile(facultyMember.FacultyID)}
                          className="view-profile-button"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Footer */}
              <div className="table-footer">
                <div className="footer-info">
                  <span>
                    Showing {filteredFaculty.length} of {faculty.length} faculty members
                    {searchTerm && ` • Filtered by: "${searchTerm}"`}
                  </span>
                </div>
                <div className="footer-actions">
                  <button className="export-button">
                    📊 Export Data
                  </button>
                  <button 
                    onClick={loadFacultyData}
                    className="refresh-button"
                  >
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