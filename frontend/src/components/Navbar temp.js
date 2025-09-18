import React from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate= useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-title">
          <i className="fas fa-graduation-cap"></i>
          <span onClick={ ()=>{
            navigate('/')
          }}>  Faculty Data Management System</span>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;