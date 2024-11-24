import React, { useState, useEffect } from "react";
import { Button, Autocomplete, AutocompleteItem } from "@nextui-org/react";

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
  const [selectedRenewItem, setSelectedRenewItem] =
    useState<CheckedOutItem | null>(null);
  const [message, setMessage] = useState("");
  const [renewMessage, setRenewMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRenewProcessing, setIsRenewProcessing] = useState(false);
  const [selection, setSelection] = useState<"checkin" | "renew" | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Fetch checked-out items from the backend
  useEffect(() => {
    const fetchCheckedOutItems = async () => {
      try {
        const response = await fetch("https://mis-565-front-end.vercel.app/checked-out");
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
      const response = await fetch(`https://mis-565-front-end.vercel.app/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: selectedItem.ITEMID }),
      });

      if (response.ok) {
        setMessage("Item checked in successfully.");
        setCheckedOutItems((prevItems) =>
          prevItems.filter((item) => item.ITEMID !== selectedItem.ITEMID)
        );
        setSelectedItem(null);
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

  // Handle the item renew
  const handleRenew = async () => {
    if (!selectedRenewItem) {
      setRenewMessage("Please select an item to renew.");
      return;
    }

    setIsRenewProcessing(true);
    try {
      const response = await fetch(`https://mis-565-front-end.vercel.app/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: selectedRenewItem.ITEMID,
          checkoutId: selectedRenewItem.Transactions[0].CHECKOUTID,
          ext_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const formattedDueDate = data.newDueDate
          ? data.newDueDate.split("T")[0]
          : "unknown date";
        setRenewMessage(
          `Item renewed successfully. New due date: ${formattedDueDate}`
        );
      } else if (response.status === 400) {
        const errorData = await response.json();
        setRenewMessage(
          errorData.message || "Cannot renew item more than twice."
        );
      } else {
        const errorData = await response.json();
        setRenewMessage(errorData.message || "Error renewing the item.");
      }
    } catch (error) {
      console.error("Error:", error);
      setRenewMessage("Network error when trying to renew the item.");
    } finally {
      setIsRenewProcessing(false);
    }
  };

  // Handle input change for autocomplete
  const handleInputChange = (value: string) => {
    setInputValue(value);
    const matchedItem = checkedOutItems.find(
      (item) => item.ITEMID.toString() === value
    );

    if (selection === "checkin") {
      setSelectedItem(matchedItem || null);
    } else if (selection === "renew") {
      setSelectedRenewItem(matchedItem || null);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-20">
      <div className="form-section text-center p-6 bg-white rounded shadow-lg max-w-sm w-full">
        {!selection && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              What would you like to do?
            </h2>
            <Button
              onClick={() => setSelection("checkin")}
              color="primary"
              className="w-full mt-4"
            >
              Check In
            </Button>
            <Button
              onClick={() => setSelection("renew")}
              color="primary"
              className="w-full mt-4"
            >
              Renew
            </Button>
          </>
        )}

        {(selection === "checkin" || selection === "renew") && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {selection === "checkin" ? "Check-In Item" : "Renew Item"}
            </h2>

            <Autocomplete
              label="Item ID"
              placeholder="Search for an item by ID"
              onInputChange={(value) => handleInputChange(value)}
              value={inputValue}
              className="max-w-xs"
              color="primary"
            >
              {checkedOutItems.map((item) => (
                <AutocompleteItem
                  key={item.ITEMID}
                  value={item.ITEMID.toString()}
                >
                  {item.ITEMID.toString()}
                </AutocompleteItem>
              ))}
            </Autocomplete>

            <Button
              onClick={selection === "checkin" ? handleCheckIn : handleRenew}
              isLoading={
                selection === "checkin" ? isProcessing : isRenewProcessing
              }
              color="primary"
              className="w-full mt-4"
            >
              {selection === "checkin" ? "Check In" : "Renew"}
            </Button>

            {(selection === "checkin" ? message : renewMessage) && (
              <div className="mt-4 text-sm text-red-500 font-semibold">
                <p>{selection === "checkin" ? message : renewMessage}</p>
              </div>
            )}

            <Button onClick={() => setSelection(null)} className="w-full mt-4">
              Back
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
