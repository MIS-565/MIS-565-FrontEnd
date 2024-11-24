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
      const response = await fetch("https://mis-565-front-end.vercel.app/patrons", {
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
    <div className="add-patron-container bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
        Add New Patron
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddPatron();
        }}
        className="patron-form flex flex-col gap-4"
      >
        <div className="form-group flex flex-col gap-1">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="patron-input"
            required
          />
        </div>
        <div className="form-group flex flex-col gap-1">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="patron-input"
            required
          />
        </div>
        <div className="form-group flex flex-col gap-1">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="patron-input"
            required
          />
        </div>
        <div className="form-group flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="patron-input"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-600 transition-all"
        >
          Add Patron
        </button>
      </form>

      {/* Popup notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            {/* Close Button */}
            <button className="close-button" onClick={handleClosePopup}>
              &times;
            </button>

            <h3>New Patron Created!</h3>

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
        </div>
      )}
    </div>
  );
};

export default AddPatron;
