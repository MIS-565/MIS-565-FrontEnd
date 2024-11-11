import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavTabs.css";

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
        to="/search-patron" 
        className={`nav-link ${location.pathname === "/search-patron" ? "active" : ""}`}
      >
        <button className="button">Search Patron</button>
      </Link>
      
      <Link 
        to="/Check-out" 
        className={`nav-link ${location.pathname === "/Check-out" ? "active" : ""}`}
      >
        <button className="button">Check Out Items</button>
      </Link>
      
      <Link 
        to="/Add-patron" 
        className={`nav-link ${location.pathname === "/Add-patron" ? "active" : ""}`}
      >
        <button className="button">Add Patron</button>
      </Link>
    </div>
  );
};

export default NavTabs;
