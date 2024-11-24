import React, { useEffect, useState } from "react";
import { useCheckout } from "./CheckoutContext";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
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
  const { itemIDs, setItemIDs, setItemData, setIsItemAvailable, itemData, isItemAvailable, selectedItems, setSelectedItems } = useCheckout();
  const [items, setItems] = useState<Item[]>([]);
  // const [selectedItems, setSelectedItems] = useState<Item[]>([]);  // New state for selected items
  const [inputValue, setInputValue] = useState("");
  const [searchMode, setSearchMode] = useState("name");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://mis-565-backend-production.up.railway.app/items");
        const data = await response.json();
        const availableItems = data.filter((item: Item) => item.STATUS == "AVAILABLE");
        setItems(availableItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    let matchedItem;
    if (searchMode === "name") {
      matchedItem = items.find((item) => item.ITEMNAME === value);
    } else if (searchMode === "id") {
      matchedItem = items.find((item) => item.ITEMID.toString() === value);
    }

    if (matchedItem) {
      setIsItemAvailable(matchedItem.STATUS === "AVAILABLE");
    } else {
      setIsItemAvailable(false);
    }
  };

  const handleSelectItem = (item: Item) => {
    if (selectedItems.length >= 3) {
      alert("You can only check out up to 3 items.");
      return;
    }
    if (selectedItems.some(selectedItem => selectedItem.ITEMID === item.ITEMID)) {
      alert("This item has already been selected.");
      return;  // Return early to prevent adding the item
    }
    setSelectedItems([...selectedItems, item]);
    setItemData([...itemData, item]);  // Add item data to context
    setItemIDs([...itemIDs, item.ITEMID.toString()]);  // Add item ID to context
  };

  const handleRemoveItem = (itemID: number) => {
    const updatedItems = selectedItems.filter(item => item.ITEMID !== itemID);
    setSelectedItems(updatedItems);
    setItemData(updatedItems);
    setItemIDs(updatedItems.map(item => item.ITEMID.toString()));
  };

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h1 style={{ textDecorationColor: "black" }}>Search for Item</h1>
          <p style={{ marginTop: 0, marginBottom: 10, textDecorationColor: "black" }}>You may select up to three items to check out.</p>
          <p style={{ marginTop: -10, marginBottom: 10, textDecorationColor: "black" }}>Only available items are shown.</p>

          <div className="search-mode-toggle">
            <label>
              <input
                type="radio"
                value="name"
                checked={searchMode === "name"}
                onChange={() => setSearchMode("name")}
              />
              Search by Name
            </label>
            <label>
              <input
                type="radio"
                value="id"
                checked={searchMode === "id"}
                onChange={() => setSearchMode("id")}
              />
              Search by ID
            </label>
          </div>

          <Autocomplete
            label={searchMode === "name" ? "Item Name" : "Item ID"}
            placeholder={searchMode === "name" ? "Search for an item by name" : "Search for an item by ID"}
            onInputChange={(value) => handleInputChange(value)}
            value={inputValue}
            className="max-w-xs"
            color="primary"
          >
            {items.map((item) => (
              <AutocompleteItem key={item.ITEMID} value={searchMode === "name" ? item.ITEMNAME : item.ITEMID.toString()} onClick={() => handleSelectItem(item)}>
                {searchMode === "name" ? item.ITEMNAME : item.ITEMID.toString()}
              </AutocompleteItem>
            ))}
          </Autocomplete>

{/* Selected Items Section */}
<div className="flex gap-4 flex-wrap justify-center mt-6">
{(selectedItems as Item[]).map((item) => (
  <Card key={item.ITEMID} className="max-w-[250px]">
    <CardHeader className="flex gap-3">
      <p className="text-md font-semibold text-center">{item.ITEMNAME}</p>
    </CardHeader>
    <Divider />
    <CardBody>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-default-500">Type:</p>
          <p className="font-semibold">{item.ITEMTYPE}</p>
        </div>
        <Divider />
        <div className="flex justify-between">
          <p className="text-default-500">Cost:</p>
          <p className="font-semibold">${item.ITEMCOST}</p>
        </div>
        <Divider />
        <div className="flex justify-between">
          <p className="text-default-500">Status:</p>
          <p className={`font-semibold ${item.STATUS === "AVAILABLE" ? "text-success" : "text-danger"}`}>
            {item.STATUS}
          </p>
        </div>
        <Divider />
        <div className="flex justify-between">
          <p className="text-default-500">Loan Duration:</p>
          <p className="font-semibold">{item.LOANDURATION} days</p>
        </div>
        <Divider />
        <div className="flex justify-between">
          <p className="text-default-500">Fee Rate:</p>
          <p className="font-semibold">${item.Fee_Rate}/day</p>
        </div>
        <Divider />
        <button onClick={() => handleRemoveItem(item.ITEMID)}>Remove</button>
      </div>
    </CardBody>
  </Card>
))}
</div>



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
              disabled={selectedItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step2ItemSearch;
