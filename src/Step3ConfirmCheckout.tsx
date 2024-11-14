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
    itemID,
    checkoutInfo,
    isCheckoutComplete,
    setIsCheckoutComplete,
    resetCheckout,
  } = useCheckout();

  const handleCheckout = async () => {
    if (patronID.trim() === "" || itemID.trim() === "") {
      alert("Please enter both Patron ID and Item ID.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/checkoutItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patronID, itemID }),
      });
      const data = await response.json();
      if (response.ok) {
        const formattedDueDate = new Date(data.transaction.DueDate)
          .toISOString()
          .split("T")[0];

        setCheckoutInfo({
          patronName: `${patronData?.PATRONFName} ${patronData?.PATRONLName}`,
          itemName: itemData?.ITEMNAME || "",
          dueDate: formattedDueDate,
          itemType: itemData?.ITEMTYPE || "", // Assuming the backend returns dueDate in the response
        });

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

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>Confirm Checkout</h2>

          {!isCheckoutComplete ? (
            <>
              {/* Display the checkout preparation text and Complete Checkout button */}
              <p>
                Ready to checkout '{itemData?.ITEMNAME}' for{" "}
                {patronData?.PATRONFName} {patronData?.PATRONLName}
              </p>
              <button onClick={handleCheckout}>Complete Checkout</button>
            </>
          ) : (
            <>
              {/* Display Checkout Summary after checkout is complete */}
              <div className="checkout-info">
                <h3>Checkout Summary</h3>
                <p>
                  <strong>Patron:</strong> {checkoutInfo?.patronName}
                </p>
                <p>
                  <strong>Item:</strong> {checkoutInfo?.itemName}
                </p>
                <p>
                  <strong>Item Type:</strong> {checkoutInfo?.itemType}
                </p>
                <p>
                  <strong>Due Date:</strong> {checkoutInfo?.dueDate}
                </p>
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
