import React, { useState } from "react";
import "./searchPatron.css";
import NavTabs from "./NavTabs";
import { Input } from "@nextui-org/react";

const SearchPatron: React.FC = () => {
  const [patronID, setPatronID] = useState("");
  const [patronData, setPatronData] = useState<any>(null);
  const [patronItems, setPatronItems] = useState<any[]>([]);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [showAllItems, setShowAllItems] = useState<boolean>(false); // State to control "Show More"
  const [sortOption, setSortOption] = useState<string>("itemName"); // Sorting option
  const [filterType, setFilterType] = useState<string>(""); // Empty means no filter applied

  // Handle sorting
  const sortedItems = [...patronItems].sort((a, b) => {
    if (sortOption === "itemName") {
      return a.itemName.localeCompare(b.itemName);
    } else if (sortOption === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const handlePatronIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatronID(e.target.value);
  };

  const handleSearchPatron = async () => {
    if (patronID.trim() === "") {
      alert("Please enter Patron ID.");
      return;
    }
  
    try {
      // Fetch patron data
      const response = await fetch(`https://mis-565-backend-production.up.railway.app/patrons/${patronID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setPatronData(data);
  
        // Check eligibility based on membership status, late fees, and number of checkouts
        const now = new Date();
        const issuedDate = new Date(data.LBCD_ISSUEDATE);
        const expirationDate = new Date(data.LBCD_EXPIRATIONDATE);
        const isMembershipActive =
          issuedDate &&
          expirationDate &&
          now > issuedDate &&
          now < expirationDate;
  
        const eligible =
          isMembershipActive &&
          (data.LFEE_BALANCE === null || parseFloat(data.LFEE_BALANCE) === 0) &&
          data.NUM_CHECKOUT <= 20;
  
        setIsEligible(eligible);
  
        // Fetch items associated with the patron
        const itemsResponse = await fetch(`https://mis-565-backend-production.up.railway.app/patrons/${patronID}/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const itemsData = await itemsResponse.json();

  
        if (itemsResponse.ok) {
          setPatronItems(itemsData.items); // Make sure itemsData.items has the correct structure
        } else {
          setPatronItems([]);
        }
      } else {
        alert("Patron not found.");
        setPatronData(null);
        setPatronItems([]);
        setIsEligible(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const filteredItems = sortedItems.filter((item) => {
    return filterType === "" || item.itemType === filterType;
  });
  
  

  const handleReset = () => {
    setPatronID("");
    setPatronData(null);
    setPatronItems([]);
    setIsEligible(false);
    setShowAllItems(false);
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>Search Patron Information</h2>
        <div className="flex flex-col items-center w-full gap-4">
          <Input
            type="text"
            label="Patron ID"
            placeholder="Enter Patron ID"
            value={patronID}
            onChange={handlePatronIDChange}
            variant="bordered"
            className="max-w-xs mb-4"
            required
          />
      <button onClick={handleSearchPatron}>Search Patron</button>
    </div>

        {patronData && (
          <div className="patron-info">
            <p><strong>Name:</strong> {patronData.PATRONFName} {patronData.PATRONLName}</p>
            <p><strong>Membership Status:</strong> {patronData.LBCD_isExpired === 0 ? "Active" : "Expired"}</p>
            <p><strong>Late Fees:</strong> ${patronData.LFEE_BALANCE ?? "0"}</p>
            <p><strong>Number of Checkouts:</strong> {patronData.NUM_CHECKOUT ?? "0"}</p>
            {isEligible ? (
              <p style={{ color: "green" }}>Patron is eligible for checkout.</p>
            ) : (
              <p style={{ color: "red" }}>Patron is not eligible for checkout.</p>
            )}
          </div>
        )}

        {/* Sorting Options */}
        {patronItems.length > 0 && (
          <div className="sort-filter-section">
            <label>Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="itemName">Item Name</option>
              <option value="dueDate">Due Date</option>
            </select>

            <label>Filter by Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All</option>
              <option value="Book">Book</option>
              <option value="Movie">Movie</option>
              <option value="Game">Game</option>
            </select>
          </div>
        )}

        {/* Display Patron's Checked-Out Items */}
        {patronItems.length > 0 && (
          <div className="patron-items">
            <h3>Checked-Out Items</h3>
            <ul>
              {(showAllItems ? filteredItems : filteredItems.slice(0, 3)).map(
                (item, index) => (
                  <li key={index}>
                    <strong>ItemID:</strong> {item.itemid}, <strong>Item:</strong> {item.itemName}, <strong>Type:</strong> {item.itemType}, <strong>Due Date:</strong>{" "}
                    {new Date(item.dueDate).toLocaleDateString('un-US', {timeZone: 'UTC'})}
                  </li>
                )
              )}
            </ul>
            {/* Show More / Show Less Button */}
            {filteredItems.length > 3 && (
              <button onClick={() => setShowAllItems(!showAllItems)}>
                {showAllItems ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}

        {/* Reset Button */}
        <div className="button-container">
          <button
            className="reset-button"
            onClick={handleReset}
            disabled={!patronData}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPatron;
