import React, { useState } from "react";
import "./searchPatron.css";
import NavTabs from "./NavTabs";

const SearchPatron: React.FC = () => {
  const [patronID, setPatronID] = useState("");
  const [patronData, setPatronData] = useState<any>(null); // Store patron data after search
  const [isEligible, setIsEligible] = useState<boolean>(false); // Eligibility status for checkout

  // Handle input change for Patron ID
  const handlePatronIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatronID(e.target.value);
  };

  // Handle search logic for patron search
  const handleSearchPatron = async () => {
    if (patronID.trim() === "") {
      alert("Please enter Patron ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/patrons/${patronID}`, {
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
      } else {
        alert("Patron not found.");
        setPatronData(null);
        setIsEligible(false);
      }
    } catch (error) {
      console.error("Error during search:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Reset form fields and patron data
  const handleReset = () => {
    setPatronID("");
    setPatronData(null);
    setIsEligible(false);
  };

  return (
    <div className="container">
      <div className="form-section">
        <h2>Search Patron Information</h2>
        <div>
          <label>Patron ID:</label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter Patron ID"
            value={patronID}
            onChange={handlePatronIDChange}
            required
          />
          <button onClick={handleSearchPatron}>Search Patron</button>
        </div>

        {/* Display Patron Information */}
        {patronData && (
          <div className="patron-info">
            <p>
              <strong>Name:</strong> {patronData.PATRONFName}{" "}
              {patronData.PATRONLName}
            </p>
            <p>
              <strong>Membership Status:</strong>{" "}
              {patronData.LBCD_isExpired === 0 ? "Active" : "Expired"}
            </p>

            <p>
              <strong>Late Fees:</strong> $
              {patronData.LFEE_BALANCE !== null ? patronData.LFEE_BALANCE : "0"}
            </p>
            <p>
              <strong>Number of Checkouts:</strong>{" "}
              {patronData.NUM_CHECKOUT !== null ? patronData.NUM_CHECKOUT : "0"}
            </p>
            {isEligible ? (
              <p style={{ color: "green" }}>Patron is eligible for checkout.</p>
            ) : (
              <p style={{ color: "red" }}>
                Patron is not eligible for checkout.
              </p>
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
