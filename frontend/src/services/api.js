// src/services/api.js
const API_BASE_URL = 'http://localhost:5001/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔗 Making API call to: ${url}`);

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    ...options,
  };

 // Handle request body for POST, PUT requests
  if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
    config.body = JSON.stringify(options.body);
  }

  try {
    console.log('📤 Sending request to:', url);
    console.log(config)
    console.log(config.body)
    const response = await fetch(url, config);
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API call successful:', data);
    return data;
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    
    // More specific error messages
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
};

// Research API
export const researchAPI = {
  addProject: (projectData) =>
    apiCall('/faculty/research', {
      method: 'POST',
      body: projectData,
    }),

  listProjects: () =>
    apiCall('/faculty/research'),

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
  addPublication: (publicationData) =>
    apiCall('/faculty/publication', {
      method: 'POST',
      body: publicationData,
    }),

  listPublications: () =>
    apiCall('/faculty/publication'),

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

  listExperience: () =>
    apiCall('/faculty/teaching'),

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

// Test connection
export const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:5001/test');
    return await response.json();
  } catch (error) {
    throw new Error('Backend server is not running. Please start the backend server on port 5001.');
  }
};

export { apiCall };