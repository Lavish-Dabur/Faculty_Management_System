// src/pages/FacultyProfile.jsx
import React, { useState, useEffect } from 'react';
import { facultyAPI, researchAPI, publicationAPI } from '../services/api';

const FacultyProfile = ({ user, navigate }) => {
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
      const profileData = await facultyAPI.getProfile();
      setProfile(profileData);
      setEditForm(profileData);

      // Load research projects
      const researchData = await researchAPI.listProjects();
      setResearchProjects(researchData);

      // Load publications
      const publicationsData = await publicationAPI.listPublications();
      setPublications(publicationsData);

      // Note: You'll need to create API endpoints for these
      // const awardsData = await awardsAPI.listAwards();
      // setAwards(awardsData);

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
      await researchAPI.addProject(researchForm);
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
      await publicationAPI.addPublication(publicationForm);
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

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-info">
          <h1>Faculty Profile</h1>
          <p>Welcome to your personal dashboard</p>
        </div>
        <div className="profile-actions">
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)}
              className="edit-button"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={handleSaveProfile}
                className="save-button"
              >
                💾 Save
              </button>
              <button 
                onClick={() => {
                  setEditMode(false);
                  setEditForm(profile);
                }}
                className="cancel-button"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Personal Info
        </button>
        <button 
          className={`tab-button ${activeTab === 'research' ? 'active' : ''}`}
          onClick={() => setActiveTab('research')}
        >
          🔬 Research ({researchProjects.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'publications' ? 'active' : ''}`}
          onClick={() => setActiveTab('publications')}
        >
          📚 Publications ({publications.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'awards' ? 'active' : ''}`}
          onClick={() => setActiveTab('awards')}
        >
          🏆 Awards ({awards.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'qualifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('qualifications')}
        >
          🎓 Qualifications
        </button>
        <button 
          className={`tab-button ${activeTab === 'teaching' ? 'active' : ''}`}
          onClick={() => setActiveTab('teaching')}
        >
          📖 Teaching Experience
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="profile-content">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>First Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="FirstName"
                    value={editForm.FirstName || ''}
                    onChange={handleEditChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.FirstName}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="LastName"
                    value={editForm.LastName || ''}
                    onChange={handleEditChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.LastName}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p>{profile?.Email}</p>
              </div>
              <div className="profile-field">
                <label>Role</label>
                <p>{profile?.Role}</p>
              </div>
              <div className="profile-field">
                <label>Department</label>
                <p>{profile?.Department?.DepartmentName}</p>
              </div>
              <div className="profile-field">
                <label>Gender</label>
                {editMode ? (
                  <select
                    name="Gender"
                    value={editForm.Gender || ''}
                    onChange={handleEditChange}
                    className="profile-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p>{profile?.Gender}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Date of Birth</label>
                {editMode ? (
                  <input
                    type="date"
                    name="DOB"
                    value={editForm.DOB ? editForm.DOB.split('T')[0] : ''}
                    onChange={handleEditChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.DOB ? formatDate(profile.DOB) : 'Not set'}</p>
                )}
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                {editMode ? (
                  <input
                    type="tel"
                    name="Phone_no"
                    value={editForm.Phone_no || ''}
                    onChange={handleEditChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.Phone_no || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Research Projects Tab */}
      {activeTab === 'research' && (
        <div className="research-content">
          <div className="section-header">
            <h2>Research Projects</h2>
            <button 
              className="add-button" 
              onClick={() => setShowResearchForm(!showResearchForm)}
            >
              {showResearchForm ? '❌ Cancel' : '➕ Add Project'}
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
  );
};

export default FacultyProfile;