import "./Faculty_Profile.css";
import placeholder from "../assets/profPlaceHolder.png";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Faculty_Profile() {
  const location = useLocation();
  const prev = location.state?.prev || "guest"; // fallback if direct visit
  const facultyId =location.state?.facultyId || null;
  const[faculty, setFaculty]= useState(null);
  const[loading, setLoading]= useState(true);
  const[error, setError]= useState(null);
  const[formData, setFormData]= useState({});

  useEffect(()=>{
     const fetchFaculty= async ()=>{
      try{
        const res= await fetch(`/api/faculty/${facultyId || "current"}`,{
            headers:{
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data=await res.json();
        if(!res.ok) throw new  Error(data.message || "Failed to fetch faculty");
        setFaculty(data);
        setFormData(data);
      }catch(e){
        setError(e.message);
      }finally{
        setLoading(false);
      }
     };
     fetchFaculty();
  },[facultyId]);

  const handleUpdate= async()=>{
    try{
      const res= await fetch(`/api/faculty/${facultyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.message || "Update failed");
      setFaculty(data);
      alert("Profile updated successfully!");
    }catch(e){
      alert(e.message);
    }
  };
  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!faculty) return <p>No faculty data found.</p>;

  return (
    <div className="faculty-container">
      <h1>Faculty Profile</h1>
      <div className="faculty-card">
        <div className="profile-header">
          <img
            src={faculty.photoUrl||placeholder}
            alt="Faculty"
            className="faculty-photo"
          />

          {/* Name & Department */}
          <div className="header-details">
            <h2 className="faculty-prof-name">{faculty.name}</h2>
            <p className="faculty-prof-department">
                {faculty.department}
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* Faculty Details */}
        <div className="faculty-details">
          {/* <p><span>Email:</span> johndoe@university.edu</p>
          <p><span>Phone no:</span> 123456789</p> */}
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
