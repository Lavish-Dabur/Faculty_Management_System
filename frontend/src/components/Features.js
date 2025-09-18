import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">System Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-database"></i>
            </div>
            <h3 className="feature-card-title">Centralized Faculty Database</h3>
            <p className="feature-card-description">
              Store and manage all faculty information in one secure, easily accessible location.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-book"></i>
            </div>
            <h3 className="feature-card-title">Course Management</h3>
            <p className="feature-card-description">
              Track courses, assignments, and faculty teaching assignments across departments.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="feature-card-title">Data Fetching</h3>
            <p className="feature-card-description">
              Retrieve any faculty member's data with ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;