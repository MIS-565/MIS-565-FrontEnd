import React, { useState } from "react";
import NavTabs from "./NavTabs";

const CheckoutPage: React.FC = () => {
  const [patronID, setPatronID] = useState("");
  const [itemID, setItemID] = useState("");

  // Handle input changes for patron ID and item ID
  const handlePatronIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatronID(e.target.value);
  };

  const handleItemIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemID(e.target.value);
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
        "http://localhost:5001/checkouttransaction",
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
        alert(
          `Item ID ${itemID} checked out successfully for Patron ID ${patronID}.`
        );
        setPatronID("");
        setItemID("");
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
          </div>
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
          </div>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
