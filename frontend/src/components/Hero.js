import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css'
const Hero = () => {
  const navigate=useNavigate();
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Faculty Research Portal</h1>
        
        <p className="hero-description">
          Comprehensive platform for managing faculty information, research,
          and analytics across all departments
        </p>

        <div className="hero-buttons">
          <button  className="hero-button retrieve-btn"
          onClick={()=>{
            navigate('/DashBoard')
          }
          }>
            <i className="fas fa-book"></i> 🔍 Retrieve Information
          </button>
          <button className="hero-button update-btn"
          onClick={()=>{
            navigate('/Auth')
          }
          }>
            <i className="fas fa-chart-bar"></i> 🔄 Update Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;