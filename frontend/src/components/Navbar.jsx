import React from 'react';

const Navbar = ({ user, onLogout, currentPage, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="nav-logo">
          <span>Faculty Data Management System</span>
        </div>
        
        <div className="navbar-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Welcome, {user.firstname}</span>
              <button 
                onClick={onLogout}
                className="primary-button primary-button-small bg-indigo-600"
                style={{ width: 'auto' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <span style={{ color: '#6b7280' }}>Not signed in</span>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.defaultProps = {
  user: null,
  currentPage: 'home',
  onNavigate: () => {},
  onLogout: () => console.log('Logout clicked')
};

export default Navbar;