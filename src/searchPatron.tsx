import React, { useState } from "react";
import "./searchPatron.css";
import NavTabs from "./NavTabs";

const SearchPatron: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      ITEMID: number;
      ITEMTYPE: string;
      ITEMNAME: string;
      ITEMCOST: string;
      STATUS: string;
    }>
  >([]);

  const [patronName, setPatronName] = useState("");

  // Handle input change for form fields

  // Handle input change for the search bar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search logic for patron search
  // Handle search logic for patron search
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      alert("Please enter a search term.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/patrons/${searchTerm}/items`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.items);
      } else {
        alert("Failed to search for patron items.");
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchTerm(""); // Optionally clear the search term
    setPatronName(""); // Clear the patron name
  };

  return (
    <div className="container">
      {/* Search Patrons Section */}
      <div className="form-section">
        <h2>Search Patrons</h2>
        <div>
          <label>Search by Patron ID: </label>
          <input
            type="text"
            className="search-bar"
            placeholder="Enter patron ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>

        {/* Display search results */}
        {patronName && (
          <div>
            <h3>Patron: {patronName}</h3>
            {searchResults.length > 0 ? (
              <div className="search-results">
                <button className="close-button" onClick={clearSearch}>
                  {/* Close button SVG */}
                </button>
                <h3>Items associated with {patronName}</h3>
                <ul>
                  {searchResults.map((item, index) => (
                    <li key={index}>
                      Item Name: {item.ITEMNAME}, Type: {item.ITEMTYPE}, Cost: $
                      {item.ITEMCOST}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h3>No items found for {patronName}</h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPatron;
