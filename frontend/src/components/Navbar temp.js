import React from 'react';
import './Navbar.css';
import back from "../assets/back.png"
import {useLocation ,useNavigate } from 'react-router-dom';
const Navbar = () => {
  const location= useLocation();
  const navigate= useNavigate();

  const isHome= location.pathname==="/";
  return (
    <nav className="navbar">
      {!isHome &&<img src={back}className='nav-img'
      onClick={()=>{
        navigate("/");
      }}></img>}
    </nav>
  );
};

export default Navbar;