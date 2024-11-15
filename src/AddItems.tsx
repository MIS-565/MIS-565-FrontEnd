import React, { useState } from "react";
import "./AddItems.css";

const AddItem = () => {
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemID, setItemID] = useState<string | null>(null);
  const [loanDuration, setLoanDuration] = useState<number | null>(null);
  const [feeRate, setFeeRate] = useState<number | null>(null);
  const [branchID] = useState(1); // Assuming branch ID is constant or retrieved elsewhere
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle Item Type change and calculate associated values
  const handleItemTypeChange = (type: string) => {
    setItemType(type);

    switch (type) {
      case "Book":
        setLoanDuration(21);
        setFeeRate(0.25);
        break;
      case "Movie":
        setLoanDuration(14);
        setFeeRate(0.5);
        break;
      case "Game":
        setLoanDuration(28);
        setFeeRate(1.0);
        break;
      default:
        setLoanDuration(null); // Set to null when item type is not selected
        setFeeRate(null);
    }
  };

  const handleAddItem = async () => {
    const newItemData = {
      ITEMTYPE: itemType,
      ITEMNAME: itemName,
      ITEMCOST: parseFloat(itemCost),
      BRANCHID: branchID,
      LOANDURATION: loanDuration,
      FEE_RATE: feeRate,
    };

    try {
      const response = await fetch("http://localhost:5001/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemData),
      });

      if (response.ok) {
        const data = await response.json();
        setItemID(data.ItemID); // Get the new ItemID from the backend response
        setShowPopup(true); // Trigger the popup
      } else {
        alert("Failed to add item. Please try again.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setItemName("");
    setItemType("");
    setItemCost("");
    setItemID(null);
    setLoanDuration(null); // Reset to null
    setFeeRate(null); // Reset to null
  };

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }}
        className="item-form"
      >
        <div className="form-group">
          <label>Item Type:</label>
          <select
            value={itemType}
            onChange={(e) => handleItemTypeChange(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Please select --
            </option>
            <option value="Book">Book</option>
            <option value="Movie">Movie</option>
            <option value="Game">Game</option>
          </select>
        </div>

        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Item Cost:</label>
          <input
            type="number"
            value={itemCost}
            onChange={(e) => setItemCost(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Item
        </button>
      </form>

      {/* Popup notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>New Item Created!</h3>
            <p>New Item ID: {itemID}</p>
          </div>
          <button onClick={handleClosePopup}>OK</button>
        </div>
      )}
    </div>
  );
};

export default AddItem;
