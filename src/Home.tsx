import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { FaUsersGear } from "react-icons/fa6";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { IoLibrary } from "react-icons/io5";

const HomePage: React.FC = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="main-heading">Welcome to the Wayback Public Library System</h1>
          <p className="sub-heading">
            Empowering librarians with modern tools to provide seamless service, 
            manage resources efficiently, and create an exceptional experience for our patrons.
          </p>
        </div>
      </div>

      <div className="features-section">
        {/* Patron Management Feature Card */}
        <div className="feature-card patron-card">
          <div className="card-header">
            <FaUsersGear className="feature-icon" />
            <h2>Patron Management</h2>
          </div>
          <p>Easily search, add, and manage patron information with our intuitive interface.</p>
          <Link to="/search-patron" className="card-link">
            <BsArrowUpRightCircleFill className="link-icon" />
          </Link>
        </div>

        {/* Item Checkout Feature Card */}
        <div className="feature-card checkout-card">
          <div className="card-header">
            <MdOutlineShoppingCartCheckout className="feature-icon" />
            <h2>Item Checkout</h2>
          </div>
          <p>Streamline the checkout process with our efficient system.</p>
          <Link to="/Check-out" className="card-link">
            <BsArrowUpRightCircleFill className="link-icon" />
          </Link>
        </div>

        {/* View All Items Feature Card */}
        <div className="feature-card items-card">
          <div className="card-header">
            <IoLibrary className="feature-icon" /> {/* Adjust icon as needed */}
            <h2>View All Items</h2>
          </div>
          <p>Browse through the library's entire collection.</p>
          <Link to="/items" className="card-link">
            <BsArrowUpRightCircleFill className="link-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
