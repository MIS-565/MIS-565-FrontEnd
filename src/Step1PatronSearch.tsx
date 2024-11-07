import React from "react";
import { useCheckout } from "./CheckoutContext";

const Step1PatronSearch = ({ onNext, onReset }: { onNext: () => void; onReset: () => void }) => {
  const {
    patronID,
    setPatronID,
    setPatronData,
    setIsEligible,
    patronData,
    isEligible,
    setItemID,
    setItemData,
    setCheckoutInfo
  } = useCheckout();

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
        const now = new Date();
        const issuedDate = new Date(data.LBCD_ISSUEDATE);
        const expirationDate = new Date(data.LBCD_EXPIRATIONDATE);
        const isMembershipActive = issuedDate && expirationDate && now > issuedDate && now < expirationDate;

        const eligible =
          isMembershipActive &&
          (data.LFEE_BALANCE === null || parseFloat(data.LFEE_BALANCE) === 0) &&
          data.NUM_CHECKOUT <= 20;

        setIsEligible(eligible);
      } else {
        alert("Patron not found.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setPatronID("");
    setPatronData(null);
    setIsEligible(false);
    setCheckoutInfo(null);
    setItemID("");
    setItemData(null);
  };

  const handleClearLateFees = async () => {
    try {
      const response = await fetch(`http://localhost:5001/patrons/${patronID}/clear-late-fees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Late fees cleared successfully.");
        // Refresh patron data after clearing late fees
        handleSearchPatron();
      } else {
        alert("Failed to clear late fees.");
      }
    } catch (error) {
      console.error("Error clearing late fees:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRenewMembership = async () => {
    try {
      const response = await fetch(`http://localhost:5001/patrons/${patronID}/renew-membership`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Membership renewed successfully.");
        // Refresh patron data after renewing membership
        handleSearchPatron();
      } else {
        alert("Failed to renew membership.");
      }
    } catch (error) {
      console.error("Error renewing membership:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>Start Checkout Process By Searching For Patron</h2>
          <div>
            <label> Patron ID: </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Patron ID"
              value={patronID}
              onChange={(e) => setPatronID(e.target.value)}
              required
            />
            <button onClick={handleSearchPatron}>Search Patron</button>
          </div>

          {/* Display Patron Information */}
          {patronData && (
            <div className="patron-info">
              <p>
                <strong>Name:</strong> {patronData.PATRONFName} {patronData.PATRONLName}
              </p>
              <p>
                <strong>Membership Status:</strong>{" "}
                {patronData.LBCD_isExpired === 0 ? "Active" : "Expired"}
              </p>
              <p>
                <strong>Late Fees:</strong> ${patronData.LFEE_BALANCE !== null ? patronData.LFEE_BALANCE : "0"}
              </p>
              <p>
                <strong>Number of Checkouts:</strong> {patronData.NUM_CHECKOUT !== null ? patronData.NUM_CHECKOUT : "0"}
              </p>
              {isEligible ? (
                <p style={{ color: "green" }}>Patron is eligible for checkout.</p>
              ) : (
                <p style={{ color: "red" }}>Patron is not eligible for checkout.</p>
              )}

              {/* Display Clear Late Fees and Do Not Pay Late Fees buttons if there are outstanding fees */}
              {parseFloat(patronData.LFEE_BALANCE) > 0 && (
                <>
                  <button onClick={handleClearLateFees} style={{ marginTop: "10px" }}>
                    Clear Late Fees
                  </button>
                  <button
                    onClick={handleReset}
                    style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
                  >
                    Do Not Pay Late Fees
                  </button>
                </>
              )}

              {/* Display Renew Membership button if membership is expired */}
              {patronData.LBCD_isExpired === 1 && (
                <>
                <button onClick={handleRenewMembership} style={{ marginTop: "10px" }}>
                  Renew Membership
                </button>
                <button
                    onClick={handleReset}
                    style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
                  >
                    Do Not Renew Membership
                  </button>
                </>
              )}
            </div>
          )}

          {/* Next and Reset Buttons */}
          <div className="button-container">
            <button
              className="reset-button"
              style={{ marginRight: 10 }}
              onClick={handleReset}
              disabled={!patronData}
            >
              Reset
            </button>
            <button
              className="next-button"
              onClick={onNext}
              disabled={!patronData || !isEligible}
              title={!patronData ? "Please search for a patron first" : !isEligible ? "Patron is not eligible for checkout" : ""}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1PatronSearch;
