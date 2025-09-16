import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar temp.js";
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from "./components/Footer.js";
function RetrieveInfo() {
  return ;
}

function UpdateInfo() {
  return ;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/retrieve" element={<RetrieveInfo />} />
          <Route path="/update" element={<UpdateInfo />} />
        </Routes>
      </div>
       <Hero />
        <Features />
        <Footer/>
    </Router>
  );
}

export default App;
