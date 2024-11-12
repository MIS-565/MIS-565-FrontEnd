// Step2ItemSearch.tsx
import React, {useEffect, useState} from "react";
import { useCheckout } from "./CheckoutContext";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

interface Item {
  ITEMID: number;
  ITEMNAME: string;
  ITEMTYPE: string;
  ITEMCOST: number;
  STATUS: string;
  LOANDURATION: number;
  Fee_Rate: number;
}

const Step2ItemSearch = ({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) => {
  const { itemID, setItemID, setItemData, setIsItemAvailable, itemData, isItemAvailable } = useCheckout();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5001/items");
        const data = await response.json();
        console.log('Data', data)
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  

  const handleInputChange = (value: string) => {
    setInputValue(value);
  
    // Check if the entered value matches an item name in the list
    const matchedItem = items.find((item) => item.ITEMNAME === value);
    if (matchedItem) {
      setSelectedItem(matchedItem);
      setItemData(matchedItem);
      setItemID(matchedItem.ITEMID.toString());
      setIsItemAvailable(matchedItem.STATUS === "AVAILABLE");
    } else {
      setSelectedItem(null); // Clear selection if no match
      setItemData(null); // Clear item data in context if no match
      setItemID("");
    }
  };
  


  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>Search for Item</h2>
          
          <Autocomplete 
            label="Item Name" 
            placeholder="Search for an item by name"
            onInputChange={(value) => handleInputChange(value)}
            value={inputValue}
            className="max-w-xs"
            color="primary"
          >
              {items.map((item) => (
                <AutocompleteItem key={item.ITEMID} value={item.ITEMNAME}>
                  {item.ITEMNAME}
                </AutocompleteItem>
              ))}
          </Autocomplete>
         
          {/* Display selected item details */}
          {selectedItem && (
            <Card className="max-w-[300px] mx-auto mt-6">
              <CardHeader className="flex gap-3">
                  <p className="text-md font-semibold text-center">{selectedItem.ITEMNAME}</p>
              </CardHeader>
              <Divider/>
              <CardBody>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <p className="text-default-500">Type:</p>
                    <p className="font-semibold">{selectedItem.ITEMTYPE}</p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Cost:</p>
                    <p className="font-semibold">${selectedItem.ITEMCOST}</p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Status:</p>
                    <p className={`font-semibold ${selectedItem.STATUS === "AVAILABLE" ? "text-success" : "text-danger"}`}>
                      {selectedItem.STATUS}
                    </p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Loan Duration:</p>
                    <p className="font-semibold">{selectedItem.LOANDURATION} days</p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Fee Rate:</p>
                    <p className="font-semibold">${selectedItem.Fee_Rate}/day</p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Checkout Eligibility:</p>
                    <p className={`font-semibold ${isItemAvailable ? "text-success" : "text-danger"}`}>
                      {isItemAvailable ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
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
              title={
                !isItemAvailable ? "Item must be available to proceed" : ""
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </>
  );
};

export default Step2ItemSearch;
