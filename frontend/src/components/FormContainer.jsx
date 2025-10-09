import React from 'react';

const FormContainer = ({ title, children, navigate }) => {
  return (
    <div className="form-page-container">
      <div className="form-container-comp">  {/* Changed class name */}
        <div className="form-header">
          <button 
            onClick={() => navigate('home')}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>
        
        <div className="form-content">
          <h1 className="form-title">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;