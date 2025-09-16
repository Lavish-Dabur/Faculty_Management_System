import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-title">
          <i className="fas fa-graduation-cap"></i>
          <span> 🎓 FacultyDB</span>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;