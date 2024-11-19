import React, { useState, useEffect } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";

interface Transaction {
  CHECKOUTID: number;
}

interface CheckedOutItem {
  ITEMID: number;
  ITEMNAME: string;
  Transactions: Transaction[];
}

const CheckIn = () => {
  const [checkedOutItems, setCheckedOutItems] = useState<CheckedOutItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CheckedOutItem | null>(null);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch checked out items from the backend
  useEffect(() => {
    const fetchCheckedOutItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/checked-out');
        if (response.ok) {
          const data = await response.json();
          setCheckedOutItems(data);
        } else {
          setMessage("Failed to fetch checked out items.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("Error fetching checked out items.");
      }
    };

    fetchCheckedOutItems();
  }, []);

    // Handle the item check-in
    const handleCheckIn = async () => {
      if (!selectedItem) {
        setMessage("Please select an item to check in.");
        return;
      }
  
      setIsProcessing(true);
      try {
        const response = await fetch(`http://localhost:5001/check-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: selectedItem.ITEMID }),
        });
  
        if (response.ok) {
          setMessage("Item checked in successfully.");
          setSelectedItem(null); // Clear the selection
           // Remove checked-in item from list
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Error checking in the item.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("Network error when trying to check in the item.");
      } finally {
        setIsProcessing(false);
      }
    };
  
    return (
      <div className="flex items-start justify-center min-h-screen pt-20">
        <div className="form-section text-center p-6 bg-white rounded shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-semibold mb-6">Check-In Item</h2>
  
          {/* Select Component for Item */}
          <Select
            placeholder="Select an item to check in"
            onChange={(e) => {
              const selected = checkedOutItems.find(item => item.ITEMID === Number(e.target.value));
              setSelectedItem(selected || null); // Set the selected item object
            }}
            value={selectedItem ? selectedItem.ITEMID.toString() : ""} // Convert to string for Select
          >
            {checkedOutItems.map((item) => (
              <SelectItem key={item.ITEMID}>
                {item.ITEMNAME}
              </SelectItem>
            ))}
          </Select>
  
          {/* Button to submit Item ID */}
          <Button
            onClick={handleCheckIn}
            isLoading={isProcessing}
            color="primary"
            className="w-full mt-4"
          >
            Check In
          </Button>
  
          {/* Message below the button */}
          {message && (
            <div className="mt-4 text-sm text-red-500 font-semibold">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default CheckIn;
    