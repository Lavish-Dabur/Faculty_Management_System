// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';

const AdminDashboard = ({ user, navigate }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const pendingData = await adminAPI.getPendingRequests();
      setPendingRequests(pendingData);
      
    } catch (error) {
      console.error('Error loading pending requests:', error);
      setError('Failed to load pending requests. Please try again.');
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
        await loadPendingRequests(); // Refresh data
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
        await loadPendingRequests(); // Refresh data
      } catch (error) {
        alert('Error rejecting faculty: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title="Go to Dashboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="mt-2 text-indigo-100 text-lg">Welcome back, {user?.FirstName} {user?.LastName}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/30">
                <p className="text-sm text-indigo-100">Pending Requests</p>
                <p className="text-3xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </div>
          {error && (
            <div className="mt-4 bg-red-500/20 backdrop-blur-sm border border-red-300 text-white px-4 py-3 rounded-lg">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay with Blur */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
            <p className="text-gray-700 font-semibold text-lg">Processing...</p>
          </div>
        </div>
      )}

      {/* Pending Approvals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Pending Faculty Approvals</h2>
          <p className="mt-2 text-gray-600">Review and approve new faculty applications</p>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
              <span className="text-6xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-600 text-lg">All faculty applications have been processed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingRequests.map((request) => (
              <div key={request.FacultyID} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-orange-500">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">
                            {request.FirstName} {request.LastName}
                          </h4>
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full mt-1">
                            Pending Approval
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">📧</span>
                          <span className="text-gray-600"><strong>Email:</strong> {request.Email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">🏛️</span>
                          <span className="text-gray-600">
                            <strong>Department:</strong> {request.Department?.DepartmentName || 'Not assigned'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">👔</span>
                          <span className="text-gray-600">
                            <strong>Role:</strong> 
                            <span className="ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded">
                              {request.Role}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">📅</span>
                          <span className="text-gray-600">
                            <strong>Applied:</strong> {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <button
                        onClick={() => handleApprove(request.FacultyID, `${request.FirstName} ${request.LastName}`)}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <span>✓</span>
                        <span>{actionLoading ? 'Processing...' : 'Approve'}</span>
                      </button>
                      <button 
                        onClick={() => handleReject(request.FacultyID, `${request.FirstName} ${request.LastName}`)}
                        disabled={actionLoading}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <span>✕</span>
                        <span>{actionLoading ? 'Processing...' : 'Reject'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;