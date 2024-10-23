import React, { useState } from "react";
import "./SimpleForm.css"; // Import the CSS file

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
      ITEMID: number;
      ITEMTYPE: string;
      ITEMNAME: string;
      ITEMCOST: string;
      STATUS: string;
  }>>([]);

  const [patronName, setPatronName] = useState("");


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
      const response = await fetch(`https://mis-565-backend-production.up.railway.app/patrons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PATRONFName: formData.firstName,
          PATRONLName: formData.lastName
        }),
      });

      if (response.ok) {
        alert(`Successfully added ${formData.firstName} ${formData.lastName}`);
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
  // Handle search logic for patron search
const handleSearch = async () => {
  if (searchTerm.trim() === "") {
    alert("Please enter a search term.");
    return;
  }

  try {
    const response = await fetch(
      `https://mis-565-backend-production.up.railway.app/patrons/${searchTerm}/items`,
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
      setPatronName(data.patronName); // Assuming you have state to store this
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
        {searchResults.length > 0 && (
          <div className="search-results">
              <button className="close-button" onClick={clearSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </button>
              <h3>Items associated with {patronName}</h3>
              <ul>
                  {searchResults.map((item, index) => (
                      <li key={index}>
                          Item Name: {item.ITEMNAME}, Type: {item.ITEMTYPE}, Cost: ${item.ITEMCOST}
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
