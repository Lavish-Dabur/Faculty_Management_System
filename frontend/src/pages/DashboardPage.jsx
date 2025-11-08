import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`/api/dashboard/dashboard-stats/${user?.FacultyID}`);
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
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Publications"
          count={stats?.counts?.publications || 0}
          link="/publications"
        />
        <StatCard
          title="Research Projects"
          count={stats?.counts?.researchProjects || 0}
          link="/research"
        />
        <StatCard
          title="Patents"
          count={stats?.counts?.patents || 0}
          link="/patents"
        />
        <StatCard
          title="Awards"
          count={stats?.counts?.awards || 0}
          link="/awards"
        />
        <StatCard
          title="Events"
          count={stats?.counts?.events || 0}
          link="/events"
        />
        <StatCard
          title="Outreach Activities"
          count={stats?.counts?.outreachActivities || 0}
          link="/outreach"
        />
        <StatCard
          title="Subjects Taught"
          count={stats?.counts?.subjectsTaught || 0}
          link="/teaching"
        />
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500">Teaching Experience</h3>
          <p className="text-2xl font-bold">{stats?.experience?.teachingYears || 0} years</p>
        </div>
      </div>

      {/* Citation Metrics and Trends */}
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Citation Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500">h-index</h3>
              <p className="text-2xl font-bold">{stats?.citations?.hIndex || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500">i10-index</h3>
              <p className="text-2xl font-bold">{stats?.citations?.i10Index || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-gray-500">Total Citations</h3>
              <p className="text-2xl font-bold">{stats?.citations?.totalCitations || 0}</p>
            </div>
          </div>
        </div>
        
        {/* Citation Trends Chart */}
        {stats?.citations?.trends?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-700 font-semibold mb-4">Citation Trends</h3>
            <div className="h-64">
              <LineChart
                width={800}
                height={240}
                data={stats.citations.trends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="YearRecorded" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="TotalCitations" stroke="#8884d8" name="Total Citations" />
                <Line type="monotone" dataKey="HIndex" stroke="#82ca9d" name="h-index" />
                <Line type="monotone" dataKey="I10Index" stroke="#ffc658" name="i10-index" />
              </LineChart>
            </div>
          </div>
        )}
      </div>

      {/* Academic Profile Overview */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Qualifications */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-700 font-semibold mb-4">Qualifications</h3>
          {stats?.qualifications?.length > 0 ? (
            <div className="space-y-3">
              {stats.qualifications.map((qual, index) => (
                <div key={index} className="border-b last:border-0 pb-2">
                  <p className="font-medium">{qual.Degree}</p>
                  <p className="text-sm text-gray-500">{qual.Institution} • {qual.YearOfCompletion}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No qualifications recorded</p>
          )}
        </div>

        {/* Activity Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-700 font-semibold mb-4">Activity Distribution</h3>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'Publications', value: stats?.counts?.publications || 0 },
                  { name: 'Research', value: stats?.counts?.researchProjects || 0 },
                  { name: 'Patents', value: stats?.counts?.patents || 0 },
                  { name: 'Awards', value: stats?.counts?.awards || 0 },
                  { name: 'Events', value: stats?.counts?.events || 0 }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {[
                  '#8884d8',
                  '#82ca9d',
                  '#ffc658',
                  '#ff7300',
                  '#0088fe'
                ].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          {stats?.recentActivity?.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.type}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add Publication"
            description="Record a new publication"
            link="/publications/new"
          />
          <QuickActionCard
            title="Add Research Project"
            description="Register a new research project"
            link="/research/new"
          />
          <QuickActionCard
            title="Update Profile"
            description="Keep your information up to date"
            link="/profile"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, link }) => (
  <Link to={link} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-3xl font-bold mt-2">{count}</p>
  </Link>
);

const QuickActionCard = ({ title, description, link }) => (
  <Link 
    to={link}
    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow flex flex-col"
  >
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </Link>
);

export default DashboardPage;