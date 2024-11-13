import React, { useState } from "react";
import "./AddPatronPage.css";
import { Input } from "@nextui-org/react";

const AddPatron = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [patronID, setPatronID] = useState<string | null>(null);
  const [issueDate, setIssueDate] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false); // New state for popup

  const handleAddPatron = async () => {
    const currentDate = new Date();
    const formattedIssueDate = currentDate.toISOString().split("T")[0];
    const expiry = new Date();
    expiry.setFullYear(currentDate.getFullYear() + 2);
    const formattedExpiryDate = expiry.toISOString().split("T")[0];

    setIssueDate(formattedIssueDate);
    setExpiryDate(formattedExpiryDate);

    const newPatronData = {
      PATRONID: patronID,
      PATRONFName: firstName,
      PATRONLName: lastName,
      Address: address,
      P_EMAIL: email,
      issueDate: formattedIssueDate,
      expiryDate: formattedExpiryDate,
    };

    try {
      const response = await fetch("https://mis-565-backend-production.up.railway.app/patrons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatronData),
      });
      const data = await response.json();
      if (response.ok) {
        setPatronID(data.PATRONID); // Display the patron ID
        setShowPopup(true); // Trigger the popup
      } else {
        alert("Failed to add patron. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setFirstName("");
    setLastName("");
    setAddress("");
    setEmail("");
    setPatronID("");
  };

  return (
    <div className="add-patron-container">
      <h2>Add New Patron</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddPatron();
        }}
        className="patron-form flex flex-col items-center w-full gap-4"
      >
        <div className="form-group flex flex-col items-center w-full">
          <Input
            type="text"
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            variant="bordered"
            className="max-w-xs mb-4"
            required
          />
        </div>
        <div className="form-group flex flex-col items-center w-full">
          <Input
            type="text"
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            variant="bordered"
            className="max-w-xs mb-4"
            required
          />
        </div>
        <div className="form-group flex flex-col items-center w-full">
          <Input
            type="text"
            label="Address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            variant="bordered"
            className="max-w-xs mb-4"
            required
          />
        </div>
        <div className="form-group flex flex-col items-center w-full">
          <Input
            type="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="bordered"
            className="max-w-xs mb-4"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Patron
        </button>
      </form>

      {/* Popup notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>New Patron Created!</h3>
            <p>New Patron ID: {patronID}</p>
          </div>
          {/* Display the patron ID after successfully adding */}
          {patronID && (
            <div className="patron-id-display">
              <h3>New Patron ID:</h3>
              <p>{patronID}</p>
            </div>
          )}
          {/* Display the issue and expiry dates */}
          {issueDate && expiryDate && (
            <div className="dates-display">
              <h3>Issue Date: {issueDate}</h3>
              <h3>Expiry Date: {expiryDate}</h3>
            </div>
          )}
          <button onClick={handleClosePopup}>OK</button>
        </div>
      )}
    </div>
  );
};

export default AddPatron;
