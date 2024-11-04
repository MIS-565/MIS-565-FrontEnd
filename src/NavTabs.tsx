import React from "react";
import { Link } from "react-router-dom";
import "./NavTabs.css";

const NavTabs: React.FC = () => {
  return (
    <div className="nav-tabs">
      <Link to="/" style={{ textDecoration: "none" }}>
        <button className="button">Home</button>
      </Link>
      <div className="separator"></div>
      <Link to="/search-patron" style={{ textDecoration: "none" }}>
        <button className="button"> Search Patron</button>
      </Link>
      <div className="separator"></div>
      <Link to="/Check-out" style={{ textDecoration: "none" }}>
        <button className="button">Check Out Items</button>
      </Link>
      <div className="separator"></div>
      <Link to="/Add-patron" style={{ textDecoration: "none" }}>
        <button className="button">Add Patron</button>
      </Link>
    </div>
  );
};

export default NavTabs;
