// src/pages/FacultyProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import { facultyAPI, researchAPI, publicationAPI } from '../services/api';
import BackButton from '../components/BackButton';

const FacultyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [researchProjects, setResearchProjects] = useState([]);
  const [publications, setPublications] = useState([]);
  const [awards, setAwards] = useState([]);
  const [teachingExperience, setTeachingExperience] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Track if viewing own profile

  // Form states for adding new items
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [showPublicationForm, setShowPublicationForm] = useState(false);
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [showTeachingForm, setShowTeachingForm] = useState(false);
  const [showQualificationForm, setShowQualificationForm] = useState(false);

  // Form data states
  const [researchForm, setResearchForm] = useState({
    title: '',
    typeID: '',
    fundingAgency: '',
    startDate: '',
    endDate: '',
    budget: ''
  });

  const [publicationForm, setPublicationForm] = useState({
    title: '',
    typeID: '',
    publicationYear: '',
    fundingAgency: '',
    typeOfIndexing: '',
    // Journal specific
    journalName: '',
    volumeNumber: '',
    issueNumber: '',
    issnNumber: '',
    // Book specific
    publisher: '',
    edition: '',
    volume: '',
    isbnNumber: '',
    // Conference specific
    conferenceLocation: '',
    pageNumbers: ''
  });

  const [awardForm, setAwardForm] = useState({
    awardName: '',
    awardingBody: '',
    location: '',
    yearAwarded: ''
  });

  const [teachingForm, setTeachingForm] = useState({
    organizationName: '',
    designation: '',
    startDate: '',
    endDate: '',
    natureOfWork: ''
  });

  const [qualificationForm, setQualificationForm] = useState({
    degree: '',
    institution: '',
    yearOfCompletion: ''
  });

  // Publication types from your schema
  const publicationTypes = [
    { value: 'journal', label: 'Journal Article' },
    { value: 'book', label: 'Book' },
    { value: 'conference', label: 'Conference Paper' }
  ];

  const researchTypes = [
    { value: 'research_project', label: 'Research Project' }
  ];

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Check if viewing another faculty's profile
      const viewProfileId = localStorage.getItem('viewProfileId');
      let profileData;
      let isViewingOtherProfile = false;
      
      if (viewProfileId) {
        // Viewing another faculty member's profile
        profileData = await facultyAPI.getFacultyById(viewProfileId);
        isViewingOtherProfile = true;
        setIsOwnProfile(false); // Not viewing own profile
        // Clear the viewProfileId after loading
        localStorage.removeItem('viewProfileId');
      } else {
        // Viewing own profile
        profileData = await facultyAPI.getProfile();
        setIsOwnProfile(true); // Viewing own profile
      }
      
      setProfile(profileData);
      setEditForm(profileData);

      if (isViewingOtherProfile) {
        // When viewing another profile, data is already included in profileData
        setResearchProjects(profileData.ResearchProjects || []);
        setPublications(profileData.FacultyPublicationLink?.map(link => link.Publication) || []);
        setAwards(profileData.Awards || []);
        setTeachingExperience(profileData.SubjectTaught || []);
      } else {
        // When viewing own profile, load additional data
        try {
          const researchData = await researchAPI.listProjects(user?.FacultyID);
          setResearchProjects(researchData);
        } catch (error) {
          console.error('Error loading research projects:', error);
        }

        try {
          const publicationsData = await publicationAPI.listPublications(user?.FacultyID);
          setPublications(publicationsData);
        } catch (error) {
          console.error('Error loading publications:', error);
        }
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      await facultyAPI.updateProfile(editForm);
      setProfile(editForm);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  // Research Project Handlers
  const handleResearchSubmit = async (e) => {
    e.preventDefault();
    try {
      await researchAPI.addProject(user?.FacultyID, researchForm);
      alert('Research project added successfully!');
      setShowResearchForm(false);
      setResearchForm({
        title: '',
        typeID: '',
        fundingAgency: '',
        startDate: '',
        endDate: '',
        budget: ''
      });
      loadProfileData(); // Refresh data
    } catch (error) {
      alert('Error adding research project: ' + error.message);
    }
  };

  const handleResearchChange = (e) => {
    setResearchForm({
      ...researchForm,
      [e.target.name]: e.target.value
    });
  };

  // Publication Handlers
  const handlePublicationSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicationAPI.addPublication(user?.FacultyID, publicationForm);
      alert('Publication added successfully!');
      setShowPublicationForm(false);
      setPublicationForm({
        title: '',
        typeID: '',
        publicationYear: '',
        fundingAgency: '',
        typeOfIndexing: '',
        journalName: '',
        volumeNumber: '',
        issueNumber: '',
        issnNumber: '',
        publisher: '',
        edition: '',
        volume: '',
        isbnNumber: '',
        conferenceLocation: '',
        pageNumbers: ''
      });
      loadProfileData(); // Refresh data
    } catch (error) {
      alert('Error adding publication: ' + error.message);
    }
  };

  const handlePublicationChange = (e) => {
    setPublicationForm({
      ...publicationForm,
      [e.target.name]: e.target.value
    });
  };

  // Award Handlers
  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    try {
      // You'll need to create an awardsAPI
      // await awardsAPI.addAward(awardForm);
      alert('Award added successfully!');
      setShowAwardForm(false);
      setAwardForm({
        awardName: '',
        awardingBody: '',
        location: '',
        yearAwarded: ''
      });
      loadProfileData();
    } catch (error) {
      alert('Error adding award: ' + error.message);
    }
  };

  const handleAwardChange = (e) => {
    setAwardForm({
      ...awardForm,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleExportProfile = async (format) => {
    try {
      if (!profile?.FacultyID) {
        alert('Profile data not available');
        return;
      }

      console.log('Exporting profile:', profile.FacultyID, 'Format:', format);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('format', format);
      params.append('facultyId', profile.FacultyID);

      const url = `http://localhost:5001/api/filter?${params.toString()}`;
      console.log('Export URL:', url);

      // Set appropriate Accept header based on format
      const headers = {
        'Accept': format === 'csv' 
          ? 'text/csv' 
          : format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      };

      const response = await fetch(url, { headers });
      
      console.log('Export response status:', response.status);
      console.log('Export response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Export failed');
        }
        throw new Error(`Export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      console.log('Export blob size:', blob.size, 'bytes');
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Set filename with appropriate extension
      const filename = `${profile.FirstName}_${profile.LastName}_Profile.${format === 'excel' ? 'xlsx' : format}`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export profile: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton to="/retrieve" />
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile?.FirstName?.[0]}{profile?.LastName?.[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile?.FirstName} {profile?.LastName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {profile?.Role}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{profile?.Department?.DepartmentName}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {/* Export Profile Button - Always visible */}
              <div className="relative group">
                <button 
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Profile
                </button>
                
                {/* Export Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={() => handleExportProfile('csv')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-100 rounded-t-lg transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExportProfile('excel')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-100 transition-colors"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExportProfile('pdf')}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 font-medium rounded-b-lg transition-colors"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Info
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'research' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('research')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Research
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {researchProjects.length}
                </span>
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'publications' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('publications')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Publications
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {publications.length}
                </span>
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'awards' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('awards')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Awards
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {awards.length}
                </span>
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'qualifications' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('qualifications')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Qualifications
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'teaching' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('teaching')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Teaching
              </span>
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">First Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="FirstName"
                    value={editForm.FirstName || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg">{profile?.FirstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="LastName"
                    value={editForm.LastName || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg">{profile?.LastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile?.Email}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Role</label>
                <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {profile?.Role}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Department</label>
                <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg">
                  {profile?.Department?.DepartmentName}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Gender</label>
                {editMode ? (
                  <select
                    name="Gender"
                    value={editForm.Gender || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg">{profile?.Gender}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date of Birth</label>
                {editMode ? (
                  <input
                    type="date"
                    name="DOB"
                    value={editForm.DOB ? editForm.DOB.split('T')[0] : ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg">
                    {profile?.DOB ? formatDate(profile.DOB) : 'Not set'}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="Phone_no"
                    value={editForm.Phone_no || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {profile?.Phone_no || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Research Projects Tab */}
        {activeTab === 'research' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Research Projects
              </h2>
              <button 
                onClick={() => setShowResearchForm(!showResearchForm)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showResearchForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                </svg>
                {showResearchForm ? 'Cancel' : 'Add Project'}
              </button>
            </div>

          {/* Add Research Project Form */}
          {showResearchForm && (
            <div className="form-card">
              <h3>Add New Research Project</h3>
              <form onSubmit={handleResearchSubmit} className="form-grid">
                <div className="form-field">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={researchForm.title}
                    onChange={handleResearchChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Project Type *</label>
                  <select
                    name="typeID"
                    value={researchForm.typeID}
                    onChange={handleResearchChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Type</option>
                    {researchTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Funding Agency</label>
                  <input
                    type="text"
                    name="fundingAgency"
                    value={researchForm.fundingAgency}
                    onChange={handleResearchChange}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={researchForm.startDate}
                    onChange={handleResearchChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={researchForm.endDate}
                    onChange={handleResearchChange}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Budget (₹)</label>
                  <input
                    type="number"
                    name="budget"
                    value={researchForm.budget}
                    onChange={handleResearchChange}
                    className="form-input"
                    step="0.01"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    💾 Save Project
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowResearchForm(false)}
                    className="cancel-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Research Projects List */}
          {researchProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔬</div>
              <h3>No research projects</h3>
              <p>You haven't added any research projects yet.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {researchProjects.map((project) => (
                <div key={project.ProjectID} className="project-card">
                  <h4>{project.Title}</h4>
                  <p><strong>Funding Agency:</strong> {project.FundingAgency || 'Not specified'}</p>
                  <p><strong>Start Date:</strong> {formatDate(project.StartDate)}</p>
                  <p><strong>End Date:</strong> {project.EndDate ? formatDate(project.EndDate) : 'Ongoing'}</p>
                  <p><strong>Budget:</strong> {project.Budget ? `₹${project.Budget}` : 'Not specified'}</p>
                  <div className="project-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Publications Tab */}
      {activeTab === 'publications' && (
        <div className="publications-content">
          <div className="section-header">
            <h2>Publications</h2>
            <button 
              className="add-button" 
              onClick={() => setShowPublicationForm(!showPublicationForm)}
            >
              {showPublicationForm ? '❌ Cancel' : '➕ Add Publication'}
            </button>
          </div>

          {/* Add Publication Form */}
          {showPublicationForm && (
            <div className="form-card">
              <h3>Add New Publication</h3>
              <form onSubmit={handlePublicationSubmit} className="form-grid">
                <div className="form-field">
                  <label>Publication Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={publicationForm.title}
                    onChange={handlePublicationChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Publication Type *</label>
                  <select
                    name="typeID"
                    value={publicationForm.typeID}
                    onChange={handlePublicationChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Type</option>
                    {publicationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Publication Year *</label>
                  <input
                    type="date"
                    name="publicationYear"
                    value={publicationForm.publicationYear}
                    onChange={handlePublicationChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Funding Agency</label>
                  <input
                    type="text"
                    name="fundingAgency"
                    value={publicationForm.fundingAgency}
                    onChange={handlePublicationChange}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Type of Indexing</label>
                  <input
                    type="text"
                    name="typeOfIndexing"
                    value={publicationForm.typeOfIndexing}
                    onChange={handlePublicationChange}
                    className="form-input"
                    placeholder="SCI, Scopus, Web of Science, etc."
                  />
                </div>

                {/* Journal Specific Fields */}
                {publicationForm.typeID === 'journal' && (
                  <>
                    <div className="form-field">
                      <label>Journal Name</label>
                      <input
                        type="text"
                        name="journalName"
                        value={publicationForm.journalName}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Volume Number</label>
                      <input
                        type="text"
                        name="volumeNumber"
                        value={publicationForm.volumeNumber}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Issue Number</label>
                      <input
                        type="text"
                        name="issueNumber"
                        value={publicationForm.issueNumber}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>ISSN Number</label>
                      <input
                        type="text"
                        name="issnNumber"
                        value={publicationForm.issnNumber}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                {/* Book Specific Fields */}
                {publicationForm.typeID === 'book' && (
                  <>
                    <div className="form-field">
                      <label>Publisher</label>
                      <input
                        type="text"
                        name="publisher"
                        value={publicationForm.publisher}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Edition</label>
                      <input
                        type="text"
                        name="edition"
                        value={publicationForm.edition}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Volume</label>
                      <input
                        type="text"
                        name="volume"
                        value={publicationForm.volume}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>ISBN Number</label>
                      <input
                        type="text"
                        name="isbnNumber"
                        value={publicationForm.isbnNumber}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                {/* Conference Specific Fields */}
                {publicationForm.typeID === 'conference' && (
                  <>
                    <div className="form-field">
                      <label>Conference Location</label>
                      <input
                        type="text"
                        name="conferenceLocation"
                        value={publicationForm.conferenceLocation}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Page Numbers</label>
                      <input
                        type="text"
                        name="pageNumbers"
                        value={publicationForm.pageNumbers}
                        onChange={handlePublicationChange}
                        className="form-input"
                      />
                    </div>
                  </>
                )}

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    💾 Save Publication
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowPublicationForm(false)}
                    className="cancel-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Publications List */}
          {publications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No publications</h3>
              <p>You haven't added any publications yet.</p>
            </div>
          ) : (
            <div className="publications-list">
              {publications.map((pub) => (
                <div key={pub.PublicationID} className="publication-card">
                  <h4>{pub.Publication?.Title}</h4>
                  <p><strong>Year:</strong> {new Date(pub.Publication?.PublicationYear).getFullYear()}</p>
                  <p><strong>Type:</strong> {pub.Publication?.Type?.TypeName}</p>
                  <p><strong>Indexing:</strong> {pub.TypeOfIndexing || 'Not specified'}</p>
                  <p><strong>Funding Agency:</strong> {pub.Publication?.FundingAgency || 'Not specified'}</p>
                  <div className="publication-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="awards-content">
          <div className="section-header">
            <h2>Awards & Recognitions</h2>
            <button 
              className="add-button" 
              onClick={() => setShowAwardForm(!showAwardForm)}
            >
              {showAwardForm ? '❌ Cancel' : '➕ Add Award'}
            </button>
          </div>

          {/* Add Award Form */}
          {showAwardForm && (
            <div className="form-card">
              <h3>Add New Award</h3>
              <form onSubmit={handleAwardSubmit} className="form-grid">
                <div className="form-field">
                  <label>Award Name *</label>
                  <input
                    type="text"
                    name="awardName"
                    value={awardForm.awardName}
                    onChange={handleAwardChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Awarding Body</label>
                  <input
                    type="text"
                    name="awardingBody"
                    value={awardForm.awardingBody}
                    onChange={handleAwardChange}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={awardForm.location}
                    onChange={handleAwardChange}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Year Awarded *</label>
                  <input
                    type="number"
                    name="yearAwarded"
                    value={awardForm.yearAwarded}
                    onChange={handleAwardChange}
                    required
                    className="form-input"
                    min="1900"
                    max="2030"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    💾 Save Award
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAwardForm(false)}
                    className="cancel-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Awards List */}
          {awards.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <h3>No awards</h3>
              <p>You haven't added any awards yet.</p>
            </div>
          ) : (
            <div className="awards-list">
              {awards.map((award) => (
                <div key={award.AwardID} className="award-card">
                  <h4>{award.AwardName}</h4>
                  <p><strong>Awarding Body:</strong> {award.AwardingBody || 'Not specified'}</p>
                  <p><strong>Location:</strong> {award.Location || 'Not specified'}</p>
                  <p><strong>Year:</strong> {award.YearAwarded}</p>
                  <div className="award-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Qualifications Tab */}
      {activeTab === 'qualifications' && (
        <div className="qualifications-content">
          <div className="section-header">
            <h2>Qualifications</h2>
            <button 
              className="add-button" 
              onClick={() => setShowQualificationForm(!showQualificationForm)}
            >
              {showQualificationForm ? '❌ Cancel' : '➕ Add Qualification'}
            </button>
          </div>

          {/* Add Qualification Form */}
          {showQualificationForm && (
            <div className="form-card">
              <h3>Add New Qualification</h3>
              <form onSubmit={handleAwardSubmit} className="form-grid">
                <div className="form-field">
                  <label>Degree *</label>
                  <input
                    type="text"
                    name="degree"
                    value={qualificationForm.degree}
                    onChange={(e) => setQualificationForm({...qualificationForm, degree: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Institution *</label>
                  <input
                    type="text"
                    name="institution"
                    value={qualificationForm.institution}
                    onChange={(e) => setQualificationForm({...qualificationForm, institution: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Year of Completion *</label>
                  <input
                    type="date"
                    name="yearOfCompletion"
                    value={qualificationForm.yearOfCompletion}
                    onChange={(e) => setQualificationForm({...qualificationForm, yearOfCompletion: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    💾 Save Qualification
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowQualificationForm(false)}
                    className="cancel-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Qualifications List */}
          {qualifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>No qualifications</h3>
              <p>You haven't added any qualifications yet.</p>
            </div>
          ) : (
            <div className="qualifications-list">
              {qualifications.map((qual) => (
                <div key={qual.QualificationID} className="qualification-card">
                  <h4>{qual.Degree}</h4>
                  <p><strong>Institution:</strong> {qual.Institution}</p>
                  <p><strong>Year:</strong> {new Date(qual.YearOfCompletion).getFullYear()}</p>
                  <div className="qualification-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teaching Experience Tab */}
      {activeTab === 'teaching' && (
        <div className="teaching-content">
          <div className="section-header">
            <h2>Teaching Experience</h2>
            <button 
              className="add-button" 
              onClick={() => setShowTeachingForm(!showTeachingForm)}
            >
              {showTeachingForm ? '❌ Cancel' : '➕ Add Experience'}
            </button>
          </div>

          {/* Add Teaching Experience Form */}
          {showTeachingForm && (
            <div className="form-card">
              <h3>Add Teaching Experience</h3>
              <form onSubmit={handleAwardSubmit} className="form-grid">
                <div className="form-field">
                  <label>Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={teachingForm.organizationName}
                    onChange={(e) => setTeachingForm({...teachingForm, organizationName: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={teachingForm.designation}
                    onChange={(e) => setTeachingForm({...teachingForm, designation: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={teachingForm.startDate}
                    onChange={(e) => setTeachingForm({...teachingForm, startDate: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={teachingForm.endDate}
                    onChange={(e) => setTeachingForm({...teachingForm, endDate: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label>Nature of Work</label>
                  <textarea
                    name="natureOfWork"
                    value={teachingForm.natureOfWork}
                    onChange={(e) => setTeachingForm({...teachingForm, natureOfWork: e.target.value})}
                    className="form-input"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    💾 Save Experience
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowTeachingForm(false)}
                    className="cancel-button"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Teaching Experience List */}
          {teachingExperience.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h3>No teaching experience</h3>
              <p>You haven't added any teaching experience yet.</p>
            </div>
          ) : (
            <div className="teaching-list">
              {teachingExperience.map((exp) => (
                <div key={exp.ExperienceID} className="experience-card">
                  <h4>{exp.OrganizationName}</h4>
                  <p><strong>Designation:</strong> {exp.Designation}</p>
                  <p><strong>Period:</strong> {formatDate(exp.StartDate)} - {exp.EndDate ? formatDate(exp.EndDate) : 'Present'}</p>
                  <p><strong>Nature of Work:</strong> {exp.NatureOfWork || 'Not specified'}</p>
                  <div className="experience-actions">
                    <button className="action-btn edit">Edit</button>
                    <button className="action-btn delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default FacultyProfile;