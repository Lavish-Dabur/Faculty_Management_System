// src/pages/FacultyProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import { facultyAPI, researchAPI, publicationAPI, awardsAPI, qualificationsAPI, teachingAPI, eventsAPI, outreachAPI, subjectsAPI } from '../services/api';
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
  const [subjectsTaught, setSubjectsTaught] = useState([]);
  const [eventsOrganised, setEventsOrganised] = useState([]);
  const [outreachActivities, setOutreachActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isOwnProfile, setIsOwnProfile] = useState(true); // Track if viewing own profile

  // Forms removed from profile view (managed in dedicated pages)

  // Form data moved to dedicated list/edit pages; removed from profile view

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
        // Use nested relations returned by the public getFacultyById endpoint.
        // Avoid calling protected endpoints when the viewer is not authenticated.
        setResearchProjects(profileData.ResearchProjects || []);
        setPublications(profileData.FacultyPublicationLink || []);
        setAwards(profileData.Awards || []);
        setTeachingExperience(profileData.TeachingExperience || []);
        setQualifications(profileData.FacultyQualification || []);
        setSubjectsTaught(profileData.SubjectTaught || []);
        setEventsOrganised(profileData.EventsOrganised || []);
        setOutreachActivities(profileData.OutReachActivities || []);
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

        try {
          const awardsData = await awardsAPI.listAwards();
          setAwards(awardsData);
        } catch (error) {
          console.error('Error loading awards:', error);
        }

        try {
          const qualificationsData = await qualificationsAPI.listQualifications();
          setQualifications(qualificationsData);
        } catch (error) {
          console.error('Error loading qualifications:', error);
        }

        try {
          const teachingData = await teachingAPI.listExperience();
          setTeachingExperience(teachingData);
        } catch (error) {
          console.error('Error loading teaching experience:', error);
        }

        try {
          const eventsData = await eventsAPI.listEvents(user?.FacultyID);
          setEventsOrganised(eventsData);
        } catch (error) {
          console.error('Error loading events:', error);
        }

        try {
          const outreachData = await outreachAPI.listActivities(user?.FacultyID);
          setOutreachActivities(outreachData);
        } catch (error) {
          console.error('Error loading outreach activities:', error);
        }

        try {
          const subjectsData = await subjectsAPI.listSubjects(user?.FacultyID);
          setSubjectsTaught(subjectsData);
        } catch (error) {
          console.error('Error loading subjects:', error);
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

  // Add/edit handlers moved to dedicated pages; removed from profile view

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
        'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv'
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
      
      // Set filename with appropriate extension (Excel export removed)
      const filename = `${profile.FirstName}_${profile.LastName}_Profile.${format === 'pdf' ? 'pdf' : 'csv'}`;
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
                  {/* Excel export removed */}
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

        {/* Add new tabs for Subjects, Events, and Outreach */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'subjects' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('subjects')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Subjects
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {subjectsTaught.length}
                </span>
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'events' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('events')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Events
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {eventsOrganised.length}
                </span>
              </span>
            </button>
            <button 
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'outreach' 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('outreach')}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Outreach
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {outreachActivities.length}
                </span>
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

            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* keep existing editable inputs when in edit mode */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={editForm.FirstName || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    value={editForm.LastName || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={editForm.Email || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Role</label>
                  <input
                    type="text"
                    name="Role"
                    value={editForm.Role || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Department</label>
                  <input
                    type="text"
                    name="DepartmentName"
                    value={editForm.Department?.DepartmentName || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Gender</label>
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date of Birth</label>
                  <input
                    type="date"
                    name="DOB"
                    value={editForm.DOB ? editForm.DOB.split('T')[0] : ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    name="Phone_no"
                    value={editForm.Phone_no || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card-style display similar to Subjects/Events/Outreach */}
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Name</h4>
                  <p className="text-gray-700 mt-2">{profile?.FirstName} {profile?.LastName}</p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-700 mt-2">{profile?.Email}</p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Role</h4>
                  <p className="text-gray-700 mt-2">{profile?.Role}</p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Department</h4>
                  <p className="text-gray-700 mt-2">{profile?.Department?.DepartmentName}</p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Gender</h4>
                  <p className="text-gray-700 mt-2">{profile?.Gender || 'Not set'}</p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Date of Birth</h4>
                  <p className="text-gray-700 mt-2">{profile?.DOB ? formatDate(profile.DOB) : 'Not set'}</p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-700 mt-2">{profile?.Phone_no || 'Not set'}</p>
                </div>
              </div>
            )}
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
            </div>
            

          {/* Research Projects List */}
          {researchProjects.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">🔬</div>
              <h3 className="text-xl font-bold text-gray-900">No research projects</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {researchProjects.map((project) => (
                <div key={project.ProjectID} className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{project.Title}</h4>
                  <div className="mt-3 text-sm text-gray-700 grid gap-2">
                    <div><strong>Funding Agency:</strong> {project.FundingAgency || 'Not specified'}</div>
                    <div><strong>Start Date:</strong> {project.StartDate ? formatDate(project.StartDate) : 'Not set'}</div>
                    <div><strong>End Date:</strong> {project.EndDate ? formatDate(project.EndDate) : 'Ongoing'}</div>
                    <div><strong>Budget:</strong> {project.Budget ? `₹${project.Budget}` : 'Not specified'}</div>
                  </div>
                  {isOwnProfile && (
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">Edit</button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Publications Tab */}
      {activeTab === 'publications' && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Publications
            </h2>
          </div>
          

          {/* Publications List */}
          {publications.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-gray-900">No publication</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publications.map((link) => {
                const pub = link.Publication || {};
                let year = '';
                try { year = pub.PublicationYear ? new Date(pub.PublicationYear).getFullYear() : ''; } catch(e) { year = pub.PublicationYear || ''; }
                return (
                  <div key={link.LinkID} className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-900 text-lg">{pub.Title || 'Untitled'}</h4>
                    <div className="mt-3 text-sm text-gray-700 grid gap-1">
                      <div><strong>Year:</strong> {year || 'Not specified'}</div>
                      <div><strong>Type:</strong> {pub.Type?.Type || 'Not specified'}</div>
                      <div><strong>Indexing:</strong> {link.TypeOfIndexing || 'Not specified'}</div>
                      <div><strong>Funding Agency:</strong> {pub.FundingAgency || 'Not specified'}</div>
                    </div>
                    {isOwnProfile && (
                      <div className="mt-4 flex gap-2">
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">Edit</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Delete</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="awards-content">
          <div className="section-header">
          </div>

          {/* Awards List */}
          {awards.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-gray-900">No awards</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((award) => (
                <div key={award.AwardID} className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{award.AwardName}</h4>
                  <div className="mt-3 text-sm text-gray-700 grid gap-1">
                    <div><strong>Awarding Body:</strong> {award.AwardingBody || 'Not specified'}</div>
                    <div><strong>Location:</strong> {award.Location || 'Not specified'}</div>
                    <div><strong>Year:</strong> {award.YearAwarded || 'Not specified'}</div>
                  </div>
                  {isOwnProfile && (
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">Edit</button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Delete</button>
                    </div>
                  )}
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
          </div>

          {/* Qualifications List */}
          {qualifications.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">🎓</div>
              <h3 className="text-xl font-bold text-gray-900">No qualifications</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualifications.map((qual) => (
                <div key={qual.QualificationID} className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{qual.Degree}</h4>
                  <div className="mt-3 text-sm text-gray-700 grid gap-1">
                    <div><strong>Institution:</strong> {qual.Institution || 'Not specified'}</div>
                    <div><strong>Year:</strong> {qual.YearOfCompletion ? (new Date(qual.YearOfCompletion).getFullYear ? new Date(qual.YearOfCompletion).getFullYear() : qual.YearOfCompletion) : 'Not specified'}</div>
                  </div>
                  {isOwnProfile && (
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">Edit</button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Delete</button>
                    </div>
                  )}
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
            
          </div>

         

          {/* Teaching Experience List */}
          {teachingExperience.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">📖</div>
              <h3 className="text-xl font-bold text-gray-900">No teaching experience</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachingExperience.map((exp) => (
                <div key={exp.ExperienceID} className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{exp.OrganizationName}</h4>
                  <div className="mt-3 text-sm text-gray-700 grid gap-1">
                    <div><strong>Designation:</strong> {exp.Designation || 'Not specified'}</div>
                    <div><strong>Period:</strong> {exp.StartDate ? formatDate(exp.StartDate) : 'Not set'} - {exp.EndDate ? formatDate(exp.EndDate) : 'Present'}</div>
                    <div><strong>Nature of Work:</strong> {exp.NatureOfWork || 'Not specified'}</div>
                  </div>
                  {isOwnProfile && (
                    <div className="mt-4 flex gap-2">
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">Edit</button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subjects Taught Tab */}
      {activeTab === 'subjects' && (
        <div className="subjects-content bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Subjects Taught
            </h2>
          </div>
          

          {subjectsTaught.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">📖</div>
              <h3 className="text-xl font-bold text-gray-900">No subjects added</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectsTaught.map((subject) => (
                <div key={subject.SubjectTaughtID} className="bg-linear-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{subject.SubjectName}</h4>
                  <p className="text-gray-600 mt-1"><strong>Level:</strong> {subject.Level}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events Organised Tab */}
      {activeTab === 'events' && (
        <div className="events-content bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events Organised
            </h2>
          </div>

          {eventsOrganised.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">🎪</div>
              <h3 className="text-xl font-bold text-gray-900">No events added</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {eventsOrganised.map((event) => (
                <div key={event.EventOrganisedID} className="border-l-4 border-indigo-500 bg-indigo-50 p-5 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{event.Title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                    <p><strong>Organizer:</strong> {event.Organizer || 'Not specified'}</p>
                    <p><strong>Location:</strong> {event.Location || 'Not specified'}</p>
                    <p><strong>Role:</strong> {event.Role || 'Not specified'}</p>
                    <p><strong>Funding:</strong> {event.FundingAgency || 'Not specified'}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2"><strong>Date Range:</strong> {event.StartDate ? formatDate(event.StartDate) : 'Not set'} - {event.EndDate ? formatDate(event.EndDate) : 'Ongoing'}</p>
                  {event.Description && <p className="text-sm text-gray-700 mt-2"><strong>Description:</strong> {event.Description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outreach Activities Tab */}
      {activeTab === 'outreach' && (
        <div className="outreach-content bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Outreach Activities
            </h2>
          </div>

          {outreachActivities.length === 0 ? (
            <div className="empty-state text-center py-12">
              <div className="empty-icon text-5xl mb-3">🤝</div>
              <h3 className="text-xl font-bold text-gray-900">No outreach activities</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {outreachActivities.map((activity) => (
                <div key={activity.ActivityID} className="border-l-4 border-green-500 bg-green-50 p-5 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 text-lg">{activity.ActivityTitle}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 text-sm">
                    <p><strong>Type:</strong> {activity.ActivityType}</p>
                    <p><strong>Institution:</strong> {activity.InstitutionName || 'Not specified'}</p>
                    <p><strong>Date:</strong> {formatDate(activity.ActivityDate)}</p>
                  </div>
                  {activity.Description && <p className="text-sm text-gray-700 mt-2"><strong>Description:</strong> {activity.Description}</p>}
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