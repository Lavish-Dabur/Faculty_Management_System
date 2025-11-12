import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.FirstName} {user?.LastName}
          </p>
        </div>
      </div>
      
      {/* Overview Stats - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Publications"
          count={stats?.counts?.publications || 0}
          link="/publications"
          addLink="/publications/new"
        />
        <StatCard
          title="Research Projects"
          count={stats?.counts?.researchProjects || 0}
          link="/research"
          addLink="/research/new"
        />
        <StatCard
          title="Patents"
          count={stats?.counts?.patents || 0}
          link="/patents"
          addLink="/patents/new"
        />
        <StatCard
          title="Awards"
          count={stats?.counts?.awards || 0}
          link="/awards"
          addLink="/awards/new"
        />
      </div>

      {/* Overview Stats - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Events"
          count={stats?.counts?.events || 0}
          link="/events"
          addLink="/events/new"
        />
        <StatCard
          title="Outreach Activities"
          count={stats?.counts?.outreachActivities || 0}
          link="/outreach"
          addLink="/outreach/new"
        />
        <StatCard
          title="Subjects Taught"
          count={stats?.counts?.subjectsTaught || 0}
          link="/teaching"
          addLink="/teaching/new"
        />
        <StatCard
          title="Qualifications"
          count={stats?.counts?.qualifications || 0}
          link="/qualifications"
          addLink="/qualifications/new"
        />
      </div>

      {/* Citation Metrics */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Citation Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">h-index</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.citations?.hIndex || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">i10-index</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.citations?.i10Index || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Citations</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.citations?.totalCitations || 0}</p>
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