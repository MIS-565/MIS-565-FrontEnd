import React from "react";
import { useCheckout } from "./CheckoutContext";
import { Card, CardHeader, CardBody, Divider, Input } from "@nextui-org/react";

const Step1PatronSearch = ({
  onNext,
  onReset,
}: {
  onNext: () => void;
  onReset: () => void;
}) => {
  const {
    patronID,
    setPatronID,
    setPatronData,
    setIsEligible,
    patronData,
    isEligible,
    setItemID,
    setItemData,
    setCheckoutInfo,
  } = useCheckout();

  const handleSearchPatron = async () => {
    if (patronID.trim() === "") {
      alert("Please enter Patron ID.");
      return;
    }
    try {
      const response = await fetch(
        `https://mis-565-backend-production.up.railway.app/patrons/${patronID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPatronData(data);
        const now = new Date();
        const issuedDate = new Date(data.LBCD_ISSUEDATE);
        const expirationDate = new Date(data.LBCD_EXPIRATIONDATE);
        const isMembershipActive =
          issuedDate &&
          expirationDate &&
          now > issuedDate &&
          now < expirationDate;
        const eligible =
          isMembershipActive &&
          (data.LFEE_BALANCE === null || parseFloat(data.LFEE_BALANCE) === 0) &&
          data.NUM_CHECKOUT <= 20;
        // Check eligibility here (your logic)
        setIsEligible(eligible);
      } else {
        alert("Patron not found.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setPatronID("");
    setPatronData(null);
    setIsEligible(false);
    setCheckoutInfo(null);
    setItemID("");
    setItemData(null);
  };

  const handleClearLateFees = async () => {
    try {
      const response = await fetch(`https://mis-565-backend-production.up.railway.app/patrons/${patronID}/clear-late-fees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Late fees cleared successfully.");
        // Refresh patron data after clearing late fees
        handleSearchPatron();
      } else {
        alert("Failed to clear late fees.");
      }
    } catch (error) {
      console.error("Error clearing late fees:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRenewMembership = async () => {
    try {
      const response = await fetch(`https://mis-565-backend-production.up.railway.app/patrons/${patronID}/renew-membership`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Membership renewed successfully.");
        // Refresh patron data after renewing membership
        handleSearchPatron();
      } else {
        alert("Failed to renew membership.");
      }
    } catch (error) {
      console.error("Error renewing membership:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-section">
          <h2 style={{ textDecorationColor: "black" }}>
            Start Checkout Process By Searching For Patron
          </h2>
          <div className="flex flex-col items-center w-full gap-4">
            <Input
              type="text"
              label="Patron ID"
              placeholder="Enter Patron ID"
              value={patronID}
              onChange={(e) => setPatronID(e.target.value)}
              variant="bordered"
              className="max-w-xs"
              required
            />
            <button onClick={handleSearchPatron}>Search Patron</button>
          </div>

          {/* Display Patron Information */}
          {patronData && (
            <Card className="max-w-[400px] mx-auto mt-6">
              <CardHeader className="flex gap-3">
                  <p className="text-md font-semibold text-center">
                    {patronData.PATRONFName} {patronData.PATRONLName}
                  </p>
              </CardHeader>
              <Divider/>
              <CardBody>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between">
                    <p className="text-default-500">Membership Status:</p>
                    <p className={`font-semibold ${patronData.LBCD_isExpired === 0 ? "text-success" : "text-danger"}`}>
                      {patronData.LBCD_isExpired === 0 ? "Active" : "Expired"}
                    </p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Late Fees:</p>
                    <p className="font-semibold">
                      ${patronData.LFEE_BALANCE !== null ? patronData.LFEE_BALANCE : "0"}
                    </p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Number of Checkouts:</p>
                    <p className="font-semibold">
                    {patronData.NUM_CHECKOUT !== null ? patronData.NUM_CHECKOUT : "0"}
                    </p>
                  </div>
                  <Divider/>
                  <div className="flex justify-between">
                    <p className="text-default-500">Checkout Eligibility:</p>
                    <p className={`font-semibold ${isEligible ? "text-success" : "text-danger"}`}>
                      {isEligible ? "Eligible" : "Not Eligible"}
                    </p>
                  </div>
                </div>
              </CardBody>

            </Card>
          )}
            {/* Display Clear Late Fees and Do Not Pay Late Fees buttons if there are outstanding fees */}
            {patronData && parseFloat(patronData.LFEE_BALANCE) > 0 && (
                <>
                  <button onClick={handleClearLateFees} style={{ marginTop: "10px" }}>
                    Clear Late Fees
                  </button>
                  <button
                    onClick={handleReset}
                    style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
                  >
                    Do Not Pay Late Fees
                  </button>
                </>
              )}

              {/* Display Renew Membership button if membership is expired */}
              {patronData && patronData.LBCD_isExpired === 1 && (
                <>
                <button onClick={handleRenewMembership} style={{ marginTop: "10px" }}>
                  Renew Membership
                </button>
                <button
                    onClick={handleReset}
                    style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
                  >
                    Do Not Renew Membership
                  </button>
                </>
              )}
          {/* Next and Reset Buttons */}
          <div className="button-container">
            <button
              className="reset-button"
              style={{ marginRight: 10 }}
              onClick={handleReset}
              disabled={!patronData}
            >
              Reset
            </button>
            <button
              className="next-button"
              onClick={onNext}
              disabled={!patronData || !isEligible}
              title={
                !patronData
                  ? "Please search for a patron first"
                  : !isEligible
                  ? "Patron is not eligible for checkout"
                  : ""
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1PatronSearch;
