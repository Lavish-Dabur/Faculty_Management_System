import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css'
import search from '../assets/search.png'
import update from '../assets/update.png'
import SearchPage from './SearchPage';
const Hero = () => {
  const navigate=useNavigate();
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Faculty Data Management System</h1>
        
        <p className="hero-description">
          Comprehensive platform for managing faculty information, research,
          and analytics across all departments
        </p>

        <div className="hero-buttons">
          <button  className="hero-button retrieve-btn"
          onClick={()=>{
            navigate('/SearchPage')
          }
          }>
            <i className="fas fa-book"></i> 
            <img  src={search} className='btn-logo'></img>
             Retrieve Information
          </button>
          <button className="hero-button update-btn"
          onClick={()=>{
            navigate('/Auth')
          }
          }>
            <i className="fas fa-chart-bar"></i>
              <img  src={update} className='btn-logo'></img>
              Update Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;