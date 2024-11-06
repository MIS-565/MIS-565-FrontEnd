import React, { useState, useEffect } from "react";

interface PatronDetails {
  patronId: string;
  firstName: string;
  lastName: string;
  accountStatus: string; // Active, Expired, etc.
  overdueFines: number;
  itemsCheckedOut: number;
}

interface AccountPageProps {
  patronId: string;
  onProceedToCheckout: () => void; // Callback to trigger the checkout process
}

const AccountPage: React.FC<AccountPageProps> = ({ patronId, onProceedToCheckout }) => {
  const [patronDetails, setPatronDetails] = useState<PatronDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch the patron details when the component mounts
  useEffect(() => {
    const fetchPatronDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/patrons/${patronId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setPatronDetails({
            patronId: data.patronId,
            firstName: data.firstName,
            lastName: data.lastName,
            accountStatus: data.accountStatus,
            overdueFines: data.overdueFines,
            itemsCheckedOut: data.itemsCheckedOut,
          });
        } else {
          setError("Failed to load patron details. Please check the Patron ID.");
        }
      } catch (error) {
        setError("An error occurred while fetching patron details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatronDetails();
  }, [patronId]);

  // Check if the patron is eligible to check out items
  const isEligibleForCheckout = (): boolean => {
    if (!patronDetails) return false;
    return patronDetails.accountStatus === "Active" && patronDetails.overdueFines === 0 && patronDetails.itemsCheckedOut < 20;
  };

  return (
    <div className="account-page">
      <h2>Patron Account Details</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : patronDetails ? (
        <div>
          <p><strong>Name:</strong> {patronDetails.firstName} {patronDetails.lastName}</p>
          <p><strong>Account Status:</strong> {patronDetails.accountStatus}</p>
          <p><strong>Overdue Fines:</strong> ${patronDetails.overdueFines.toFixed(2)}</p>
          <p><strong>Items Checked Out:</strong> {patronDetails.itemsCheckedOut}/20</p>

          {!isEligibleForCheckout() && (
            <p className="warning">Patron is not eligible for checkout. Please check account status, fines, or item limit.</p>
          )}

          <button 
            onClick={onProceedToCheckout} 
            disabled={!isEligibleForCheckout()}
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <p>No patron details found.</p>
      )}
    </div>
  );
};

export default AccountPage;
