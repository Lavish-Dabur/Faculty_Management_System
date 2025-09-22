import "./DepartmentDash.css";
import placeholder from "../assets/profPlaceHolder.png"
import deptProfile from "../assets/deptProfile.png"
import { useNavigate } from "react-router-dom";

const facultyList = [
  {
    name: "Dr. John Doe",
    department: "Computer Science",
    email: "johndoe@university.edu",
    research: "AI, Machine Learning, Data Mining",
    publications: 25,
    photo: "https://via.placeholder.com/150"
  },
  {
    name: "Dr. Jane Smith",
    department: "Computer Science",
    email: "janesmith@university.edu",
    research: "Cybersecurity, Networks",
    publications: 18,
    photo: "https://via.placeholder.com/150"
  },
  {
    name: "Dr. Alan Brown",
    department: "Computer Science",
    email: "alanbrown@university.edu",
    research: "Software Engineering, Databases",
    publications: 30,
    photo: "https://via.placeholder.com/150"
  }
];

export default function DepartmentDashboard() {
  const navigate=useNavigate();
  return (
    <div className="dashboard-container">
    <div className="dept-header"> 
    <img src={deptProfile} width={80} />
      <h1 className="dashboard-title">Department of Computer Science</h1>
    </div>
     <hr className="divider"></hr>
      <div className="faculty-grid">
        {facultyList.map((faculty, index) => (
          <div key={index} className="faculty-card">
            <img
              src={placeholder}
              alt={faculty.name}
              className="faculty-photo"
            />
            <h2 className="faculty-name">{faculty.name}</h2>
            <p className="faculty-department">{faculty.department}</p>
            <hr className="divider" />
            <div className="faculty-details">
              <p><span>Email:</span> {faculty.email}</p>
              <p><span>Research:</span> {faculty.research}</p>
              <p><span>Publications:</span> {faculty.publications}+</p>
            </div>
            <div className="faculty-actions">
              <button className="btn primary"
               onClick={()=>{
               navigate("/FacultyProfile",{state:{prev:"guest"}});

               }}>View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
