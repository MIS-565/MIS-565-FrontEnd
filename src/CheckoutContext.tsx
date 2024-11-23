// CheckoutContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface PatronData {
  PATRONFName: string;
  PATRONLName: string;
  LBCD_isExpired: number;
  LFEE_BALANCE: string;
  NUM_CHECKOUT: number;
}

interface ItemData {
  ITEMID: number;
  ITEMNAME: string;
  STATUS: string;
  ITEMTYPE: string;
}

interface CheckoutInfo {
  patronName: string;
  itemName: string;
  dueDate: string;
  itemType: string;
}

interface CheckoutContextProps {
  patronID: string;
  setPatronID: (id: string) => void;
  itemIDs: string[];  // Change from single itemID to array of itemIDs
  setItemIDs: (ids: string[]) => void;
  patronData: PatronData | null;
  setPatronData: (data: PatronData | null) => void;
  itemData: ItemData[];  // Change from single itemData to array of itemData
  setItemData: (data: ItemData[]) => void;
  checkoutInfo: CheckoutInfo[];  // Change from single checkoutInfo to array of checkoutInfo
  setCheckoutInfo: (info: CheckoutInfo[]) => void;
  isEligible: boolean;
  setIsEligible: (eligible: boolean) => void;
  isItemAvailable: boolean;
  setIsItemAvailable: (available: boolean) => void;
  isCheckoutComplete: boolean;
  setIsCheckoutComplete: (complete: boolean) => void;
  resetCheckout: () => void;
  selectedItems: ItemData[];  // Add selectedItems to context
  setSelectedItems: (items: ItemData[]) => void;  // Add setSelectedItems to context
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [patronID, setPatronID] = useState("");
  const [itemIDs, setItemIDs] = useState<string[]>([]);  // Initialize as an empty array
  const [patronData, setPatronData] = useState<PatronData | null>(null);
  const [itemData, setItemData] = useState<ItemData[]>([]);  // Initialize as an empty array
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo[]>([]);  // Initialize as an empty array
  const [isEligible, setIsEligible] = useState(false);
  const [isItemAvailable, setIsItemAvailable] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ItemData[]>([]);  // Initialize selectedItems

  const resetCheckout = () => {
    setPatronID("");
    setItemIDs([]);
    setPatronData(null);
    setItemData([]);
    setCheckoutInfo([]);
    setIsEligible(false);
    setIsItemAvailable(false);
    setIsCheckoutComplete(false);
    setSelectedItems([]);  // Reset selectedItems
  };

  return (
    <CheckoutContext.Provider
      value={{
        patronID,
        setPatronID,
        itemIDs,
        setItemIDs,
        patronData,
        setPatronData,
        itemData,
        setItemData,
        checkoutInfo,
        setCheckoutInfo,
        isEligible,
        setIsEligible,
        isItemAvailable,
        setIsItemAvailable,
        isCheckoutComplete,
        setIsCheckoutComplete,
        resetCheckout,
        selectedItems,  // Provide selectedItems
        setSelectedItems,  // Provide setSelectedItems
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
