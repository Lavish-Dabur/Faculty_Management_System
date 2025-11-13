// src/services/api.js
const API_BASE_URL = 'http://localhost:5001/api';

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  };

  if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on port 5001.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  signup: (userData) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: userData,
    }),

  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST',
    }),
};

// Faculty API
export const facultyAPI = {
  getProfile: () =>
    apiCall('/faculty/getfaculty'),

  updateProfile: (profileData) =>
    apiCall('/faculty/updatefaculty', {
      method: 'PUT',
      body: profileData,
    }),

  getFacultyById: (id) =>
    apiCall(`/faculty/${id}`),

  getAllFaculty: () =>
    apiCall('/faculty/all'),
};

// Research API
export const researchAPI = {
  addProject: (facultyId, projectData) =>
    apiCall(`/faculty/research/${facultyId}`, {
      method: 'POST',
      body: projectData,
    }),

  listProjects: (facultyId) =>
    apiCall(`/faculty/research/${facultyId}`),

  updateProject: (projectId, projectData) =>
    apiCall(`/faculty/research/${projectId}`, {
      method: 'PUT',
      body: projectData,
    }),

  deleteProject: (projectId) =>
    apiCall(`/faculty/research/${projectId}`, {
      method: 'DELETE',
    }),
};

// Publication API
export const publicationAPI = {
  addPublication: (facultyId, publicationData) =>
    apiCall(`/faculty/publication/${facultyId}`, {
      method: 'POST',
      body: publicationData,
    }),

  listPublications: (facultyId) =>
    apiCall(`/faculty/publication/${facultyId}`),

  updatePublication: (publicationId, publicationData) =>
    apiCall(`/faculty/publication/${publicationId}`, {
      method: 'PUT',
      body: publicationData,
    }),

  deletePublication: (publicationId) =>
    apiCall(`/faculty/publication/${publicationId}`, {
      method: 'DELETE',
    }),
};

// Admin API
export const adminAPI = {
  getPendingRequests: () =>
    apiCall('/admin/pending'),

  getApprovedFaculty: () =>
    apiCall('/admin/faculty'),

  getAllFaculties: () =>
    apiCall('/admin/all-faculties'),

  approveFaculty: (facultyId) =>
    apiCall(`/admin/approve/${facultyId}`, {
      method: 'PUT',
    }),

  rejectFaculty: (facultyId) =>
    apiCall(`/admin/reject/${facultyId}`, {
      method: 'DELETE',
    }),

  getDepartments: () =>
    apiCall('/admin/departments'),

  addDepartment: (departmentName) =>
    apiCall('/admin/departments', {
      method: 'POST',
      body: { departmentName },
    }),

  deleteDepartment: (departmentId) =>
    apiCall(`/admin/departments/${departmentId}`, {
      method: 'DELETE',
    }),

  getDashboardStats: () =>
    apiCall('/admin/stats'),
};

export const departmentAPI = {
  getAllDepartments: async () => {
    const response = await fetch("/api/departments");
    if (!response.ok) throw new Error("Failed to fetch departments");
    return response.json();
  },
};

// Awards API
export const awardsAPI = {
  addAward: (awardData) =>
    apiCall('/faculty/awards', {
      method: 'POST',
      body: awardData,
    }),

  listAwards: () =>
    apiCall('/faculty/awards'),

  updateAward: (awardId, awardData) =>
    apiCall(`/faculty/awards/${awardId}`, {
      method: 'PUT',
      body: awardData,
    }),

  deleteAward: (awardId) =>
    apiCall(`/faculty/awards/${awardId}`, {
      method: 'DELETE',
    }),
};

// Qualifications API
export const qualificationsAPI = {
  addQualification: (qualificationData) =>
    apiCall('/faculty/qualifications', {
      method: 'POST',
      body: qualificationData,
    }),

  listQualifications: () =>
    apiCall('/faculty/qualifications'),

  updateQualification: (qualificationId, qualificationData) =>
    apiCall(`/faculty/qualifications/${qualificationId}`, {
      method: 'PUT',
      body: qualificationData,
    }),

  deleteQualification: (qualificationId) =>
    apiCall(`/faculty/qualifications/${qualificationId}`, {
      method: 'DELETE',
    }),
};

// Teaching Experience API
export const teachingAPI = {
  addExperience: (experienceData) =>
    apiCall('/faculty/teaching', {
      method: 'POST',
      body: experienceData,
    }),

  // listExperience optionally accepts a facultyId. If provided, it fetches
  // teaching records for that faculty. Otherwise returns the current user's records.
  listExperience: (facultyId) =>
    apiCall(facultyId ? `/faculty/teaching/${facultyId}` : '/faculty/teaching'),

  updateExperience: (experienceId, experienceData) =>
    apiCall(`/faculty/teaching/${experienceId}`, {
      method: 'PUT',
      body: experienceData,
    }),

  deleteExperience: (experienceId) =>
    apiCall(`/faculty/teaching/${experienceId}`, {
      method: 'DELETE',
    }),
};

// Events API
export const eventsAPI = {
  listEvents: (facultyId) =>
    apiCall(`/faculty/events/${facultyId}`),

  addEvent: (eventData) =>
    apiCall('/faculty/events', {
      method: 'POST',
      body: eventData,
    }),

  updateEvent: (eventId, eventData) =>
    apiCall(`/faculty/events/${eventId}`, {
      method: 'PUT',
      body: eventData,
    }),

  deleteEvent: (eventId) =>
    apiCall(`/faculty/events/${eventId}`, {
      method: 'DELETE',
    }),

  getEventTypes: () =>
    apiCall('/faculty/events/types'),
};

// Outreach Activities API
export const outreachAPI = {
  listActivities: (facultyId) =>
    apiCall(`/faculty/outreach/${facultyId}`),

  addActivity: (activityData) =>
    apiCall('/faculty/outreach', {
      method: 'POST',
      body: activityData,
    }),

  updateActivity: (activityId, activityData) =>
    apiCall(`/faculty/outreach/${activityId}`, {
      method: 'PUT',
      body: activityData,
    }),

  deleteActivity: (activityId) =>
    apiCall(`/faculty/outreach/${activityId}`, {
      method: 'DELETE',
    }),
};

// Subjects Taught API
export const subjectsAPI = {
  listSubjects: (facultyId) =>
    apiCall(`/faculty/subjects/${facultyId}`),

  addSubject: (subjectData) =>
    apiCall('/faculty/subjects', {
      method: 'POST',
      body: subjectData,
    }),

  updateSubject: (subjectId, subjectData) =>
    apiCall(`/faculty/subjects/${subjectId}`, {
      method: 'PUT',
      body: subjectData,
    }),

  deleteSubject: (subjectId) =>
    apiCall(`/faculty/subjects/${subjectId}`, {
      method: 'DELETE',
    }),
};

// Test connection
export const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:5001/test');
    return await response.json();
  } catch {
    throw new Error('Backend server is not running. Please start the backend server on port 5001.');
  }
};

export { apiCall };