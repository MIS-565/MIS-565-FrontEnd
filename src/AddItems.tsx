import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
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
  const navigate = useNavigate();

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
      STATUS: "AVAILABLE", // Set default status to "AVAILABLE" for new items
      BRANCHID: branchID,
      LOANDURATION: loanDuration,
      FEE_RATE: feeRate,
    };

    try {
      const response = await fetch("https://mis-565-backend-production.up.railway.app/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemData), // Pass the full object here
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

  const handleBackToItems = () => {
    navigate("/items"); // Navigate to the items page
  };

  return (
    <div className="add-item-container ">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
        Add New Item
      </h2>
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

        <button
          type="submit"
          className="w-full bg-green-500 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-all"
        >
          Add Item
        </button>
      </form>

      {/* Back to Items button */}
      <button
        onClick={handleBackToItems}
        className="w-full bg-blue-500 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-all"
      >
        Back to Items
      </button>

      {/* Popup notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>New Item Created!</h3>
            <p>New Item ID: {itemID}</p>
            <button onClick={handleClosePopup} className="ok-button">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItem;
