import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

const CheckIn = () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState(""); // For success or error messages
  const [isProcessing, setIsProcessing] = useState(false); // Track submission state

  // Handle the item check-in
  const handleCheckIn = async () => {
    if (!inputValue) {
      setMessage("Please enter a valid Item ID.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`http://localhost:5001`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ITEMID: inputValue,
        }),
      });

      if (response.ok) {
        setMessage("Item checked in successfully, association removed.");
        setInputValue(""); // Clear the input field
      } else {
        setMessage("Error removing item association.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error removing item association.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-20">
      <div className="form-section text-center p-6 bg-white rounded shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-6">Check-In Item</h2>

        {/* Input for Item ID */}
        <Input
          aria-label="Item ID"
          label="Item ID"
          placeholder="Enter Item ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-xs mx-auto mb-4"
          required
        />

        {/* Button to submit Item ID */}
        <Button
          onClick={handleCheckIn}
          isLoading={isProcessing}
          color="primary"
          className="w-full mb-4"
        >
          Check In
        </Button>

        {/* Message below the button */}
        {message && (
          <div className="mt-4 text-sm text-red-500 font-semibold">
            <p>{message}</p>
          </div>
        )}

        {/* Instructions for user */}
        <p className="mt-2 text-xs text-gray-500">
          * Please enter one Item ID at a time.
        </p>
      </div>
    </div>
  );
};

export default CheckIn;
