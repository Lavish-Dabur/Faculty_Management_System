import react from "react";
import "./Analytics.css"

export default function Analytics(){
     
    return(<div>
        <div className="ana-title">
            Analytics
        </div>
        <div className="ana-cards">
            <div className="ana-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="feature-card-title">Advanced Analytics</h3>
            <p className="feature-card-description">
              Gain insights with comprehensive reports and visualizations on faculty performance.
            </p>
          </div>
          <div className="ana-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="feature-card-title">Advanced Analytics</h3>
            <p className="feature-card-description">
              Gain insights with comprehensive reports and visualizations on faculty performance.
            </p>
          </div>
          <div className="ana-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="feature-card-title">Advanced Analytics</h3>
            <p className="feature-card-description">
              Gain insights with comprehensive reports and visualizations on faculty performance.
            </p>
          </div>
        </div>
    </div>)
}