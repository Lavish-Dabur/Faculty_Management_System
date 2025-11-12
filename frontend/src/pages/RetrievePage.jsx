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

  useEffect(() => {
    loadFacultyData();
  }, []);

  useEffect(() => {
    filterFaculty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, faculty, filterType]);

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
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                📊 Export
              </button>
              <button 
                onClick={loadFacultyData}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetrievePage;
