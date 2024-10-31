import React from "react";
import { Link } from "react-router-dom";
import SearchPatron from "./searchPatron";
import "./Home.css";
import CheckoutPage from "./CheckoutPage";
import NavTabs from "./NavTabs";

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Description below the heading */}

      <div className="text-box">
        Wayback Public Library The Wayback Public Library is a community
        resource that provides access to a wide range of informational and
        educational materials. It offers a diverse collection of books, e-books,
        and digital media, catering to all age groups and interests. The library
        hosts various programs and events, including workshops, reading clubs,
        and educational sessions, promoting lifelong learning. Additionally, it
        provides access to computers and internet resources, ensuring that all
        community members can connect and engage with information. The Wayback
        Public Library serves as a welcoming space for individuals and families
        to explore, learn, and grow together.
      </div>

      {/* Button to navigate to the Search Patron page */}

      {/* Add the SearchPatron component if needed on this page, or remove it */}
    </div>
  );
};

export default Home;
