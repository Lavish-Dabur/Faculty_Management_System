import React from 'react';
import '../styles/home.css';

const CENTRAL_ILLUSTRATION = "https://placehold.co/200x200/4f46e5/ffffff?text=U+M+S";

const HomePage = ({ navigate }) => (
  <div className="home-container">
    <div className="home-header">
      <h1 className="home-title">Faculty Data Management System</h1>
    </div>
    
    <div className="home-grid">
      <div className="home-card home-card-indigo">
        <div className="card-icon">📝</div>
        <h3 className="card-title">Update Records</h3>
        <p className="card-description">Add, edit, or modify user information and records in the system.</p>
        <button 
          onClick={() => navigate('auth_gate')} 
          className="card-button card-button-indigo"
        >
          Update Information
        </button>
      </div>
      
      <div className="home-card home-card-cyan">
        <div className="card-icon">🔍</div>
        <h3 className="card-title">View Data</h3>
        <p className="card-description">Search, browse, and view user records and information.</p>
        <button 
          onClick={() => navigate('retrieve')} 
          className="card-button card-button-cyan"
        >
          Retrieve Information
        </button>
      </div>
    </div>

    <div className="home-features">
      <div className="feature-item">
        <div className="feature-icon">⚡</div>
        <h4>Fast & Efficient</h4>
        <p>Quick access to all management features</p>
      </div>
      <div className="feature-item">
        <div className="feature-icon">🔒</div>
        <h4>Secure Access</h4>
        <p>Protected authentication system</p>
      </div>
      <div className="feature-item">
        <div className="feature-icon">📊</div>
        <h4>Comprehensive Data</h4>
        <p>Complete user information overview</p>
      </div>
    </div>
  </div>
);

export default HomePage;