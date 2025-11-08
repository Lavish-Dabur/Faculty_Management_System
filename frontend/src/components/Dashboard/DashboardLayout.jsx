import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">
              {user?.FirstName} {user?.LastName}
            </div>
            <div className="text-sm text-gray-500">{user?.Email}</div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Overview</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/publications"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Publications</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/research"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Research Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/patents"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Patents</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/teaching"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Teaching Experience</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/qualifications"
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <span className="ml-3">Qualifications</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;