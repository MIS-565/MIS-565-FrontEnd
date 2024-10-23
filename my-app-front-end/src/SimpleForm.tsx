import React, { useState } from "react";
import "./SimpleForm.css"; // Import the CSS file

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ firstName: string; lastName: string; patronid: string }>
  >([]);

  // Handle input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit for patron data entry
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Patron data inserted successfully!");
      } else {
        alert("Failed to insert patron data.");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      alert("An error occurred. Please try again.");
    }

    // Reset form fields after submission
    setFormData({
      firstName: "",
      lastName: "",
    });
  };

  // Handle input change for the search bar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search logic for patron search
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      alert("Please enter a search term.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/search?term=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results);
      } else {
        alert("Failed to search for patrons.");
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      {/* Enter Patron Details Form */}
      <div className="form-section">
        <h2>Add Patron Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Search Patrons Section */}
      <div className="form-section">
        <h2>Search Patrons</h2>
        <div>
          <label>Search by Name or Patron ID: </label>
          <input
            type="text"
            className="search-bar"
            placeholder="Enter name or patron ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>

        {/* Display search results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  Name: {result.firstName} {result.lastName}, Patron ID:{" "}
                  {result.patronid}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleForm;
