import React from "react";
import { Link } from "react-router-dom";
import "./NavTabs.css";

const NavTabs: React.FC = () => {
  return (
    <div className="nav-tabs">
      <Link to="/" style={{ textDecoration: "none" }}>
        <button className="button">Home</button>
      </Link>
      <>|</>
      <Link to="/search-patron" style={{ textDecoration: "none" }}>
        <button className="button"> Search Patron</button>
      </Link>
      <>|</>
      <Link to="/Check-out" style={{ textDecoration: "none" }}>
        <button className="button">Check Out Items</button>
      </Link>
      <>|</>
      <Link to="/Add-patron" style={{ textDecoration: "none" }}>
        <button className="button">Add Patron</button>
      </Link>
    </div>
  );
};

export default NavTabs;
