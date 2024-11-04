import React, { useState } from "react";
import "./CheckoutPage.css";

const CheckoutPage: React.FC = () => {
  const [patronID, setPatronID] = useState("");
  const [itemID, setItemID] = useState("");
  const [patronData, setPatronData] = useState<null | {
    PATRONFName: string;
    PATRONLName: string;
    LBCD_isExpired: number;
    LFEE_BALANCE: string;
  }>(null);
  const [itemData, setItemData] = useState<null | {
    ITEMNAME: string;
    STATUS: string;
  }>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<null | {
    patronName: string;
    itemName: string;
    dueDate: string;
  }>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isItemAvailable, setIsItemAvailable] = useState(false);

  // Handle input changes for patron ID and item ID
  const handlePatronIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatronID(e.target.value);
  };

  const handleItemIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemID(e.target.value);
  };

  // Step 1: Search for patron by ID
  const handleSearchPatron = async () => {
    if (patronID.trim() === "") {
      alert("Please enter Patron ID.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5001/patrons/${patronID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        setPatronData(data); // Set patron data
        const now = new Date();
        const issuedDate = new Date(data.LBCD_ISSUEDATE);
        const expirationDate = new Date(data.LBCD_EXPIRATIONDATE);
        const isMembershipActive = issuedDate && expirationDate && now > issuedDate && now < expirationDate;
  
        // Determine if membership is considered active
        const eligible = isMembershipActive && (data.LFEE_BALANCE === null || parseFloat(data.LFEE_BALANCE) === 0);
        setIsEligible(eligible);

        console.log("Is Eligible:", eligible); 
  
        if (!eligible) {
          alert(
            `Patron is not eligible for checkout. ${
              !isMembershipActive
                ? "Membership is not active."
                : ""
            } ${data.LFEE_BALANCE !== null && parseFloat(data.LFEE_BALANCE) > 0 ? "Outstanding late fees." : ""}`
          );
        }
      } else {
        alert(data.message || "Patron not found.");
      }
    } catch (error) {
      console.error("Error searching for patron:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Step 2: Search for item by ID
  const handleSearchItem = async () => {
    if (itemID.trim() === "") {
      alert("Please enter an Item ID.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5001/items/${itemID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
  
      if (response.ok) {
        setItemData(data); // Set item data
        const available = data.STATUS === "AVAILABLE";
        setIsItemAvailable(available);

        if (!available) {
          alert("Item is currently unavailable for checkout.");
        }
      } else {
        alert(data.message || "Item not found.");
      }
    } catch (error) {
      console.error("Error searching for item:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  // Handle checkout logic
  const handleCheckout = async () => {
    if (patronID.trim() === "" || itemID.trim() === "") {
      alert("Please enter both Patron ID and Item ID.");
      return;
    }

    try {
      // Send patron ID and item ID to the backend for checkout
      const response = await fetch(
        "http://localhost:5001/checkoutItem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patronID, itemID }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        const formattedDueDate = new Date(data.transaction.DueDate)
        .toISOString()
        .split("T")[0];

        setCheckoutInfo({
          patronName: `${patronData?.PATRONFName} ${patronData?.PATRONLName}`,
          itemName: itemData?.ITEMNAME || "",
          dueDate: formattedDueDate,  // Assuming the backend returns dueDate in the response
        });

        alert(
          `Item ID ${itemID} checked out successfully for Patron ID ${patronID}.`
        );

        // Clear the input fields
        setPatronID("");
        setItemID("");
        setPatronData(null);
        setItemData(null);
      } else {
        alert(data.message || "Failed to check out the item.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>Check-out Item</h2>
          <div>
            <label> Patron ID: </label>
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
                <strong>Name:</strong> {patronData.PATRONFName} {patronData.PATRONLName}
              </p>
              <p>
                <strong>Membership Status:</strong>{" "}
                {patronData.LBCD_isExpired === 0 ? "Active" : "Expired"}
              </p>
              <p>
                <strong>Late Fees:</strong> ${patronData.LFEE_BALANCE}
              </p>
              {isEligible ? (
                <p style={{ color: "green" }}>Patron is eligible for checkout.</p>
              ) : (
                <p style={{ color: "red" }}>Patron is not eligible for checkout.</p>
              )}
            </div>
          )}

          <div>
            <label> Item ID: </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Item ID"
              value={itemID}
              onChange={handleItemIDChange}
              required
            />
            <button onClick={handleSearchItem}>Search Item</button>
          </div>

          {/* Display Item Information */}
          {itemData && (
            <div className="item-info">
              <p>
                <strong>Item Name:</strong> {itemData.ITEMNAME}
              </p>
              <p>
                <strong>Status:</strong> {itemData.STATUS}
              </p>
              {isItemAvailable ? (
                <p style={{ color: "green" }}>Item is available for checkout.</p>
              ) : (
                <p style={{ color: "red" }}>Item is not available for checkout.</p>
              )}
            </div>
          )}

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={!isEligible || !isItemAvailable}
          >
            Complete Checkout
          </button>

          {/* Display Checkout Information */}
          {checkoutInfo && (
            <div className="checkout-info">
              <h3>Checkout Summary</h3>
              <p>
                <strong>Patron:</strong> {checkoutInfo.patronName}
              </p>
              <p>
                <strong>Item:</strong> {checkoutInfo.itemName}
              </p>
              <p>
                <strong>Due Date:</strong> {checkoutInfo.dueDate}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

