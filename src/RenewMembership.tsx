import React from "react";

interface RenewMembershipProps {
  patronID: string;
  onRenewSuccess: (newIssueDate: string, newExpiryDate: string) => void;
}

const RenewMembership: React.FC<RenewMembershipProps> = ({
  patronID,
  onRenewSuccess,
}) => {
  const handleRenewMembership = async () => {
    try {
      const response = await fetch(
        `https://mis-565-front-end.vercel.app/api/renewMembership`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ patronId: patronID }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Membership renewed successfully!");

        // Call onRenewSuccess to update the parent component’s state
        onRenewSuccess(data.issueDate, data.expiryDate);
      } else {
        alert("Failed to renew membership.");
      }
    } catch (error) {
      console.error("Error renewing membership:", error);
      alert("An error occurred while renewing membership.");
    }
  };

  return (
    <div>
      <button onClick={handleRenewMembership}>Renew Membership</button>
    </div>
  );
};

export default RenewMembership;
