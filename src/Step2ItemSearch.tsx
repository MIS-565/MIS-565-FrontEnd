// Step2ItemSearch.tsx
import React from "react";
import { useCheckout } from "./CheckoutContext";

const Step2ItemSearch = ({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) => {
  const { itemID, setItemID, setItemData, setIsItemAvailable, itemData, isItemAvailable } = useCheckout();

  const handleSearchItem = async () => {
    if (itemID.trim() === "") {
      alert("Please enter Item ID.");
      return;
    }
    try {
        const response = await fetch(
            `https://mis-565-backend-production.up.railway.app/items/${itemID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

      const data = await response.json();
      if (response.ok) {
        setItemData(data);
        setIsItemAvailable(data.STATUS === "AVAILABLE");
        
      } else {
        alert("Item not found.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>Search for Item</h2>
          <div>
            <label> Item ID: </label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Item ID"
              value={itemID}
              onChange={(e) => setItemID(e.target.value)}
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
                <strong>Item Type:</strong> {itemData.ITEMTYPE}
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

          {/* Navigation Buttons */}
          <div className="button-container">
            <button 
              className="back-button"
              onClick={onPrevious}
              style={{ marginRight: 10 }}
            >
              Back
            </button>
            <button
              className="next-button"
              onClick={onNext}
              disabled={!isItemAvailable}
              title={!isItemAvailable ? "Item must be available to proceed" : ""}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </>
  );
};



export default Step2ItemSearch;
