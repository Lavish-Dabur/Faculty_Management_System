import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`/dashboard/dashboard-stats/${user?.FacultyID}`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.FacultyID) {
      fetchDashboardStats();
    }
  }, [user]);

  // Redirect admins to admin dashboard
  if (user?.Role === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Faculty Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome, {user?.FirstName}</p>
        </div>
      </div>

      {/* Minimal action cards: Update Records + View Faculty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-gray-700 text-sm font-medium">Update Records</h3>
          <p className="text-gray-500 text-sm mt-2">Edit your profile, qualifications and other records.</p>
          <div className="mt-4">
            <Link to="/profile" className="text-indigo-600 hover:underline text-sm">Go to Profile</Link>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-gray-700 text-sm font-medium">View Faculty</h3>
          <p className="text-gray-500 text-sm mt-2">Browse the faculty directory and view profiles.</p>
          <div className="mt-4">
            <Link to="/retrieve" className="text-indigo-600 hover:underline text-sm">Open Directory</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, link, addLink }) => (
  <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <div className="flex items-center justify-between mt-2">
      <p className="text-4xl font-bold text-gray-900">{count}</p>
    </div>
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <Link 
        to={link} 
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
      >
        View All →
      </Link>
      <Link 
        to={addLink} 
        className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
      >
        + Add
      </Link>
    </div>
  </div>
);

export default DashboardPage;