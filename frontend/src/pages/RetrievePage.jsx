import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facultyAPI } from '../services/api';

const RetrievePage = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    loadFacultyData();
  }, []);

  useEffect(() => {
    filterFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, faculty, filterType]);

  useEffect(() => {
    // Close export menu when clicking outside
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

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

  const filterFaculty = () => {
    if (!searchTerm.trim()) {
      setFilteredFaculty(faculty);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = faculty.filter((f) => {
      if (filterType === 'all') {
        return (
          f.FirstName?.toLowerCase().includes(term) ||
          f.LastName?.toLowerCase().includes(term) ||
          f.Email?.toLowerCase().includes(term) ||
          f.Department?.DepartmentName?.toLowerCase().includes(term)
        );
      } else if (filterType === 'faculty') {
        return (
          f.FirstName?.toLowerCase().includes(term) ||
          f.LastName?.toLowerCase().includes(term) ||
          f.Email?.toLowerCase().includes(term)
        );
      } else if (filterType === 'department') {
        return f.Department?.DepartmentName?.toLowerCase().includes(term);
      }
      return true;
    });

    setFilteredFaculty(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleViewProfile = (facultyId) => {
    if (!facultyId) {
      console.error("Faculty ID missing");
      return;
    }
    localStorage.setItem("viewProfileId", facultyId);
    navigate('/faculty-profile');
  };

  const handleExport = async (format = 'csv') => {
    try {
      setLoading(true);
      setError('');
      setShowExportMenu(false);
      
      // Build query parameters based on current filters
      const params = new URLSearchParams();
      
      // Add format
      params.append('format', format);
      
      // Add department filter if not 'all'
      if (filterType !== 'all' && filterType !== 'faculty') {
        params.append('department', filterType);
      }
      
      // Add search term if exists
      if (searchTerm) {
        params.append('name', searchTerm);
      }
      
      const exportUrl = `http://localhost:5001/api/filter?${params.toString()}`;
      console.log('Export URL:', exportUrl);
      console.log('Export params:', { format, department: filterType, name: searchTerm });
      
      // Make API call to export endpoint
      const response = await fetch(exportUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf'
        }
      });
      
      console.log('Export response status:', response.status);
      console.log('Export response type:', response.type);
      console.log('Export response ok:', response.ok);
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('Error content-type:', contentType);
        
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { message: text || 'Export failed' };
        }
        
        console.error('Export error data:', errorData);
        throw new Error(errorData.message || 'Export failed');
      }
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `faculty_export_${Date.now()}.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setLoading(false);
      
      // Show success message
      const formatName = format.toUpperCase();
      alert(`✅ ${formatName} file downloaded successfully!`);
      
    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || 'Failed to export data. Please try again.');
      setLoading(false);
    }
  };

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'professor': return 'bg-blue-100 text-blue-800';
      case 'associate professor': return 'bg-green-100 text-green-800';
      case 'assistant professor': return 'bg-yellow-100 text-yellow-800';
      case 'lecturer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading faculty data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">👥</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Directory</h1>
            <p className="text-gray-600 mt-1">
              Search and browse through faculty members
              {faculty.length > 0 && ` • ${faculty.length} faculty members`}
            </p>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Dropdown */}
          <div className="w-full md:w-48">
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSearchTerm('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">All Fields</option>
              <option value="faculty">Faculty Name</option>
              <option value="department">Department</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder={
                filterType === 'all'
                  ? 'Search by name, email, or department...'
                  : filterType === 'faculty'
                  ? 'Search by faculty name or email...'
                  : 'Search by department name...'
              }
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button 
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {searchTerm && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Found {filteredFaculty.length} result{filteredFaculty.length !== 1 ? 's' : ''} for "{searchTerm}"
            </span>
            <button 
              onClick={handleClearSearch}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Faculty Grid/List */}
      {filteredFaculty.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">{searchTerm ? '🔍' : '👥'}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No faculty found' : 'No faculty members'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'No faculty members available'}
          </p>
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              View All Faculty
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-5 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200 font-semibold text-gray-700 text-sm">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Department</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredFaculty.map((facultyMember) => (
              <div key={facultyMember.FacultyID} className="md:grid md:grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 items-center">
                {/* Name */}
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {facultyMember.FirstName?.charAt(0)}{facultyMember.LastName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {facultyMember.FirstName} {facultyMember.LastName}
                    </div>
                    {facultyMember.Phone_no && (
                      <div className="text-sm text-gray-500">{facultyMember.Phone_no}</div>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div className="text-gray-600 mb-2 md:mb-0 text-sm md:text-base">
                  {facultyMember.Email}
                </div>
                
                {/* Role */}
                <div className="mb-2 md:mb-0">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleClass(facultyMember.Role)}`}>
                    <span>{getRoleIcon(facultyMember.Role)}</span>
                    {facultyMember.Role}
                  </span>
                </div>
                
                {/* Department */}
                <div className="text-gray-600 mb-3 md:mb-0">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {facultyMember.Department?.DepartmentName || 'Not assigned'}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="md:text-right">
                  <button 
                    onClick={() => handleViewProfile(facultyMember.FacultyID)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {filteredFaculty.length} of {faculty.length} faculty members
              {searchTerm && ` • Filtered by: "${searchTerm}"`}
            </div>
            <div className="flex gap-3">
              {/* Export Dropdown */}
              <div className="relative export-dropdown">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        handleExport('csv');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export as CSV
                    </button>
                    <button
                      onClick={() => {
                        handleExport('excel');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Export as Excel
                    </button>
                    <button
                      onClick={() => {
                        handleExport('pdf');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Export as PDF
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={loadFacultyData}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetrievePage;
