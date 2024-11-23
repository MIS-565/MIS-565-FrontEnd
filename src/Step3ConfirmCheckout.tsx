// Step3ConfirmCheckout.tsx
import React from "react";
import { useCheckout } from "./CheckoutContext";

const Step3ConfirmCheckout = ({
  onPrevious,
  onFinish,
}: {
  onPrevious: () => void;
  onFinish: () => void;
}) => {
  const {
    patronData,
    itemData,
    setCheckoutInfo,
    patronID,
    itemIDs,
    checkoutInfo,
    isCheckoutComplete,
    setIsCheckoutComplete,
    resetCheckout,
  } = useCheckout();

  const handleCheckout = async () => {
    if (patronID.trim() === "" || itemIDs.length === 0) {
      alert("Please enter Patron ID and select at least one item.");
      return;
    }

    const maxCheckoutLimit = 20;
    const currentCheckedOut = patronData?.NUM_CHECKOUT || 0;
    const itemsToCheckout = itemIDs.length; // Number of items selected for this checkout

    // Check if the total checkout would exceed the max limit
    if (currentCheckedOut + itemsToCheckout > maxCheckoutLimit) {
      const allowedCheckout = maxCheckoutLimit - currentCheckedOut;
      alert(
        `You are only allowed to check out ${allowedCheckout} more item(s). Please adjust your selection.`
      );
      return;
    }

    const uniqueItemIDs = Array.from(new Set(itemIDs)).slice(0, 3);
    const uniqueItemData = Array.from(new Set(itemData.map(item => item.ITEMID)))
      .map(id => itemData.find(item => item.ITEMID === id))
      .slice(0, 3);

    try {
      const response = await fetch("http://localhost:5001/checkoutItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patronID, itemIDs: uniqueItemIDs }),
      });
      const data = await response.json();
      if (response.ok) {
        const formattedDueDates = data.transactions.map((transaction: any) =>
          new Date(transaction.DueDate).toISOString().split("T")[0]
        );

        const newCheckoutInfo = uniqueItemData.map((item, index) => ({
          patronName: `${patronData?.PATRONFName} ${patronData?.PATRONLName}`,
          itemName: item?.ITEMNAME || "",
          dueDate: formattedDueDates[index],
          itemType: item?.ITEMTYPE || "",
        }));

        setCheckoutInfo(newCheckoutInfo);
        setIsCheckoutComplete(true);
        alert("Checkout completed successfully.");
      } else {
        alert("Failed to checkout.");
      }
    } catch {
      alert("An error occurred.");
    }
  };

  const handleFinish = () => {
    resetCheckout(); // Clear all data and reset to initial state
    onFinish(); // Trigger the function to go back to step 1
  };

  // Define uniqueItemData here for rendering
  const uniqueItemData = Array.from(new Set(itemData.map(item => item.ITEMID)))
    .map(id => itemData.find(item => item.ITEMID === id))
    .slice(0, 3);

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>Confirm Checkout</h2>

          {!isCheckoutComplete ? (
            <>
              {/* Display the checkout preparation text and Complete Checkout button */}
              <p>
                Ready to checkout the following items for {patronData?.PATRONFName} {patronData?.PATRONLName}:
              </p>
              <ul>
              {uniqueItemData.map((item, index) => (
                  <li key={index}>{item?.ITEMNAME}</li>
                ))}
              </ul>
              <button 
                  onClick={handleCheckout} 
                  style={{ backgroundColor: "green", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none" }}
                >
                  Complete Checkout
                </button>
            </>
          ) : (
            <>
              {/* Display Checkout Summary after checkout is complete */}
              <div className="checkout-info">
                <h3>Checkout Summary</h3>
                {checkoutInfo.map((info, index) => (
                  <div key={index}>
                    <p>
                      <strong>Patron:</strong> {info.patronName}
                    </p>
                    <p>
                      <strong>Item:</strong> {info.itemName}
                    </p>
                    <p>
                      <strong>Item Type:</strong> {info.itemType}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {info.dueDate}
                    </p>
                    <hr />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Buttons Container */}
          <div className="button-container">
            <button className="back-button1" onClick={onPrevious}>
              Back
            </button>
            <button
              className="finish-button"
              onClick={handleFinish}
              disabled={!isCheckoutComplete} // Disable until checkout is complete
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3ConfirmCheckout;
