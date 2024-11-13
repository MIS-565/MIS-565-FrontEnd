import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavTabs.css";
// Import the new button styles

const NavTabs: React.FC = () => {
  const location = useLocation();

  return (
    <div className="nav-tabs">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
      >
        <button className="button">Home</button>
      </Link>
      
      <Link 
        to="/patron" 
        className={`nav-link ${location.pathname === "/patron" ? "active" : ""}`}
      >
        <button className="button">Patron Management</button>
      </Link>
      
      <Link 
        to="/Check-out" 
        className={`nav-link ${location.pathname === "/Check-out" ? "active" : ""}`}
      >
        <button className="button">Check Out</button>
      </Link>
      
      <Link 
        to="/items" 
        className={`nav-link ${location.pathname === "/items" ? "active" : ""}`}
      >
        <button className="button">Items</button>
      </Link>
    </div>
  );
};

export default NavTabs;
