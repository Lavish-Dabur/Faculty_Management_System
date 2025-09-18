import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Auth from "./components/Auth.js";
import Home from "./components/Home.js";

import bgImage from "./assets/iStock-597963404-crop.webp"
function RetrieveInfo() {
  return ;
}

function UpdateInfo() {
  return ;
}

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <div className="p-6"
       style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.6),  
      rgba(0, 0, 0, 0.5)
    ),url(${bgImage})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/retrieve" element={<RetrieveInfo />} />
          <Route path="/update" element={<UpdateInfo />} />
          <Route path="/Auth" element={<Auth />} />

        </Routes>
      </div>
      
    </Router>
  );
}

export default App;
