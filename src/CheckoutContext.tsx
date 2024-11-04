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
  itemID: string;
  setItemID: (id: string) => void;
  patronData: PatronData | null;
  setPatronData: (data: PatronData | null) => void;
  itemData: ItemData | null;
  setItemData: (data: ItemData | null) => void;
  checkoutInfo: CheckoutInfo | null;
  setCheckoutInfo: (info: CheckoutInfo | null) => void;
  isEligible: boolean;
  setIsEligible: (eligible: boolean) => void;
  isItemAvailable: boolean;
  setIsItemAvailable: (available: boolean) => void;
  isCheckoutComplete: boolean;  // Add this
  setIsCheckoutComplete: (complete: boolean) => void;  // Add this
  resetCheckout: () => void;  // Add this
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
  const [itemID, setItemID] = useState("");
  const [patronData, setPatronData] = useState<PatronData | null>(null);
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo | null>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isItemAvailable, setIsItemAvailable] = useState(false);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  const resetCheckout = () => {
    setPatronID("");
    setItemID("");
    setPatronData(null);
    setItemData(null);
    setCheckoutInfo(null);
    setIsEligible(false);
    setIsItemAvailable(false);
    setIsCheckoutComplete(false);
  };
  
  return (
    <CheckoutContext.Provider
      value={{
        patronID,
        setPatronID,
        itemID,
        setItemID,
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
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
