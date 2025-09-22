import "./Faculty_Profile.css";
import placeholder from "../assets/profPlaceHolder.png";
import { useLocation } from "react-router-dom";

export default function Faculty_Profile() {
  const location = useLocation();
  const prev = location.state?.prev || "guest"; // fallback if direct visit

  return (
    <div className="faculty-container">
      <h1>Faculty Profile</h1>
      <div className="faculty-card">
        <div className="profile-header">
          <img
            src={placeholder}
            alt="Faculty"
            className="faculty-photo"
          />

          {/* Name & Department */}
          <div className="header-details">
            <h2 className="faculty-prof-name">Dr. John Doe</h2>
            <p className="faculty-prof-department">
              Department of Computer Science
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* Faculty Details */}
        <div className="faculty-details">
          <p><span>Email:</span> johndoe@university.edu</p>
          <p><span>Phone no:</span> 123456789</p>
        </div>

        {/* Action Buttons */}
        <div className="faculty-actions">
          <button className="btn primary">
            {prev === "auth" ? "Update Details" : "Retrieve Information"}
          </button>
        </div>
      </div>
    </div>
  );
}
