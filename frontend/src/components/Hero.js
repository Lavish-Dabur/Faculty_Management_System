import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Faculty Research Portal</h1>
        
        <p className="hero-description">
          Comprehensive platform for managing faculty information, research,
          and analytics across all departments
        </p>

        <div className="hero-buttons">
          <a href="#" className="hero-button retrieve-btn">
            <i className="fas fa-book"></i> 🔍 Retrieve Information
          </a>
          <a href="#" className="hero-button update-btn">
            <i className="fas fa-chart-bar"></i> 🔄 Update Information
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;